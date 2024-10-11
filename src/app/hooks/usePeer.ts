import Peer, { MediaConnection } from "peerjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { setLS } from "../lib/helpers/localStorage";
import { lsKeys } from "../lib/constants/localStorageKeys";
import { TCallStatus } from "../lib/types/peertypes";
import { ICallState } from "../../modules/home/context/callContext";
import { useInitializePeerCallMutation, useMakePeerCallMutation } from "../../modules/home/api/mutationEndpoints";

const usePeer: () => ICallState = () => {
  const [peerInstance, setPeerInstance] = useState<Peer>()
  const [callStatus, setCallStatus] = useState<TCallStatus>('Idle');
  const [incomingCall, setIncomingCall] = useState<MediaConnection>();
  const currentCall = useRef<MediaConnection | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const [initialize, { isError }] = useInitializePeerCallMutation();
  const [getRemotePeerId] = useMakePeerCallMutation();

  const reset = () => {
    // @ts-ignore
    localAudioRef.current?.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());
  }

  useEffect(() => {
    const peer = new Peer({
      config: { iceServers: [{ url: "stun:stun.l.google.com:19302" }] },
    });

    setPeerInstance(peer)

    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      setLS(lsKeys.PEER_ID, id);
      initialize(id)
    });

    peer.on("error", (err) => {
      console.error("Error establishling peer connection: ", err);
    });

    peer.on('call', (call) => {
      setIncomingCall(call);
      setCallStatus('Incoming call');
    });

    return () => {
      reset()
      peer.destroy();
    };
  }, []);

  useEffect(() => {
    if (isError) {
      // TODO: handle error
      console.error('Failed to store peer id', isError);
    }
  }, [isError])

  const handleStream = (call: MediaConnection) => {
    call.on('stream', (remoteStream) => {
      // const audio = new Audio();
      // audio.srcObject = remoteStream;
      // audio.play();

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play();
      }
    });

    call.on('close', () => {
      setCallStatus('Call ended');
    });

    currentCall.current = call;
    setCallStatus('In call');
  };

  const makeCall = async (userId: string) => {
    if (!peerInstance) return;

    // get remote peer id
    const resp: any = await getRemotePeerId(userId)

    if (resp.error) {
      console.error('Failed to get remote peer id', resp.error);
      return
    }

    const remotePeerId = resp.data as string

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }

        const call = peerInstance.call(remotePeerId, stream);
        handleStream(call);
      })
      .catch((err) => {
        console.error('Failed to get local stream', err);
      });
  };

  const endCall = () => {
    if (currentCall.current) {
      currentCall.current.close();
      currentCall.current = null;
      setCallStatus('Call ended');

      if (localAudioRef.current) {
        reset()
        localAudioRef.current.srcObject = null;
      }

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = null;
      }
    }
  };

  const answerCall = () => {
    if (incomingCall) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
          if (localAudioRef.current) {
            localAudioRef.current.srcObject = stream;
          }
          incomingCall.answer(stream);
          handleStream(incomingCall);
          setIncomingCall(undefined);
        })
        .catch((err) => {
          console.error('Failed to get local stream', err);
          setCallStatus('Call failed');
        });
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(undefined);
      setCallStatus('Call rejected');
    }
  };

  return useMemo(() => ({
    makeCall,
    status: callStatus
  }), [])
}

export default usePeer