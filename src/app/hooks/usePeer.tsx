import Peer, { MediaConnection } from "peerjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { TCallStatus } from "../lib/types/peertypes";
import {
  useEndPeerCallMutation,
  useMakePeerCallMutation,
} from "../../modules/home/api/mutationEndpoints";
import { CallLogStatus, MakeCallResp } from "../../modules/home/api/types";
import { Button, notification, Space } from "antd";
import {
  AudioMutedOutlined,
  AudioOutlined,
  PhoneFilled,
} from "@ant-design/icons";
import { v4 } from "uuid";
import useSocketSubscription from "./useSocketSubscription";
import { SocketEvents } from "../lib/types/webSocket";
import { emitRingingEvent } from "../../modules/home/api/sockets";
import {
  CALL_RETRY_INTERVAL,
  END_CALL_DELAY,
  MAX_CALL_WAIT_TIME,
} from "../../settings";
import callingSound from "../../../public/calling.mp3";
import { convertSecondsToTime, getPeerId } from "../lib/helpers/call";
import ContactAvatar from "../common/ContactAvatar";
import { ArgsProps } from "antd/es/notification/interface";

const CallActionButton = ({ onClick, backgroundColor, rotate = false }) => {
  return (
    <Button
      className="border-0 me-2"
      style={{
        backgroundColor,
        color: "white",
        transform: rotate ? "rotate(225deg)" : undefined,
      }}
      shape="circle"
      icon={<PhoneFilled />}
      size="large"
      onClick={onClick}
    />
  );
};

const callingAudio = new Audio(callingSound);

const closeCallingAudio = () => {
  callingAudio.pause();
  callingAudio.currentTime = 0;
};

const callNotificationKey = "call-notification";

const sharedCallNotificationProps: Partial<ArgsProps> = {
  duration: 0,
  key: callNotificationKey,
  className: "p-0 incoming-call-notification",
  icon: <></>,
  closeIcon: null,
};

interface IEndCallSession {
  duration?: number;
  sessionId: string;
  status?: CallLogStatus;
}

interface ICallSessionProps {
  callerName: string;
  onFinish: (duration: number) => void;
  onMute: (mute: boolean) => void;
}

interface IOutgoingCallSessionProps {
  receiverName: string;
  onFinish: (status?: CallLogStatus) => void;
  ringing?: boolean;
  autoEnd?: boolean;
  retryCall?: () => void;
}

const OutgoingCallSession = ({
  receiverName,
  onFinish,
  ringing,
  autoEnd,
  retryCall,
}: IOutgoingCallSessionProps) => {
  const [timer, setTimer] = useState(0);
  const [closeStatus, setCloseStatus] = useState<
    CallLogStatus | undefined | null
  >();

  const onClose = (status?: CallLogStatus) => {
    closeCallingAudio();
    setCloseStatus(status || null);
  };

  // end call
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (closeStatus !== undefined) {
      timeout = setTimeout(() => {
        onFinish(closeStatus as CallLogStatus);
      }, END_CALL_DELAY * 1000);
    }

    return () => timeout && clearTimeout(timeout);
  }, [closeStatus]);

  // timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoEnd) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [!!autoEnd]);

  // auto end call after x seconds
  useEffect(() => {
    if (timer === MAX_CALL_WAIT_TIME) {
      onClose(CallLogStatus.NotAnswered);
    }
  }, [timer]);

  // play calling audio
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const timeout = setTimeout(() => {
      callingAudio.play();

      interval = setInterval(() => {
        callingAudio.play();
      }, 4000);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      interval && clearInterval(interval);
    };
  }, []);

  // call retry logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (retryCall && !ringing) {
      interval = setInterval(() => {
        retryCall();
      }, CALL_RETRY_INTERVAL * 1000);
    }

    if (ringing) {
      setTimer(0);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [retryCall, ringing]);

  const getStatus = () => {
    if (closeStatus !== undefined) {
      return "ended";
    }

    if (ringing) {
      return "ringing";
    }

    return "calling";
  };

  return (
    <div className="p-3 d-flex align-items-center justify-content-between">
      <Space>
        <div>
          <ContactAvatar size={50} name={receiverName} />
        </div>

        <div>
          <small>{getStatus()}</small>
          <div>
            <strong className="text-capitalize" style={{ fontSize: "1.2rem" }}>
              {receiverName}
            </strong>
          </div>
        </div>
      </Space>
      <CallActionButton
        backgroundColor="red"
        onClick={() => onClose()}
        rotate
      />
    </div>
  );
};

const CallSession = ({ callerName, onFinish, onMute }: ICallSessionProps) => {
  const [timer, setTimer] = useState(0);
  const [mute, setMute] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-3 d-flex align-items-center justify-content-between">
      <Space>
        <div>
          <ContactAvatar size={50} name={callerName} />
        </div>

        <div>
          <div>
            <strong className="text-capitalize" style={{ fontSize: "1.2rem" }}>
              {callerName}
            </strong>
          </div>
          <small>{convertSecondsToTime(timer)}</small>
        </div>
      </Space>
      <Space size="large">
        <Button
          type="text"
          shape="circle"
          onClick={() => {
            setMute((m) => {
              onMute(m);
              return !m;
            });
          }}
          icon={
            mute ? (
              <AudioMutedOutlined size={20} />
            ) : (
              <AudioOutlined size={20} />
            )
          }
        />
        <CallActionButton
          backgroundColor="red"
          onClick={() => onFinish(timer)}
          rotate
        />
      </Space>
    </div>
  );
};

const usePeer = (userId: string) => {
  const [peerInstance, setPeerInstance] = useState<Peer>();
  const [callStatus, setCallStatus] = useState<TCallStatus>("Idle");
  const currentCall = useRef<MediaConnection | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [api, contextHolder] = notification.useNotification();

  const [makeCallReq] = useMakePeerCallMutation();
  const [endCallReq] = useEndPeerCallMutation();

  useSocketSubscription([
    {
      event: SocketEvents.END_CALL,
      handler: (declined) => {
        closeCallingAudio();
        closeCallSession({ skipReq: true, sessionId: "" });
      },
    },
    {
      event: SocketEvents.CALL_RINGING,
      handler: () => {
        api.info({
          message: (
            <OutgoingCallSession
              receiverName={currentCall.current?.metadata.receiverName}
              ringing
              autoEnd
              onFinish={(status) =>
                endCall({
                  duration: 0,
                  sessionId: currentCall.current?.metadata.sessionId,
                  status: status || CallLogStatus.Cancelled,
                })
              }
            />
          ),
          ...sharedCallNotificationProps,
        });
      },
    },
  ]);

  const resetTracks = () => {
    if (localAudioRef.current?.srcObject) {
      // @ts-ignore
      localAudioRef.current?.srcObject
        // @ts-ignore
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
    }
  };

  function closeCallSession({
    duration = 0,
    sessionId,
    status,
    skipReq,
  }: IEndCallSession & { skipReq?: boolean }) {
    if (localAudioRef.current) {
      resetTracks();
      localAudioRef.current.srcObject = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    if (!skipReq) {
      endCallReq({ duration, sessionId, status });
    }

    closeCallNotification();
  }

  useEffect(() => {
    const peer = new Peer(getPeerId(userId), {
      config: { iceServers: [{ url: "stun:stun.l.google.com:19302" }] },
    });

    setPeerInstance(peer);

    peer.on("open", (id) => {
      console.info("Peer connection established");
    });

    peer.on("error", (err) => {
      console.error("Error establishling peer connection: ", err);
    });

    peer.on("call", (call) => {
      emitRingingEvent(call.metadata.callerId);

      api.info({
        message: (
          <div className="p-3 d-flex align-items-center justify-content-between">
            <Space>
              <div>
                <ContactAvatar size={50} name={call.metadata.name} />
              </div>

              <div>
                <small>Incoming call</small>
                <div>
                  <strong
                    className="text-capitalize"
                    style={{ fontSize: "1.2rem" }}
                  >
                    {call.metadata.name}
                  </strong>
                </div>
              </div>
            </Space>
            <div>
              <CallActionButton
                backgroundColor="green"
                onClick={() => answerCall(call)}
              />
              <CallActionButton
                backgroundColor="red"
                onClick={() => rejectCall(call)}
                rotate
              />
            </div>
          </div>
        ),
        ...sharedCallNotificationProps,
      });

      setCallStatus("Incoming call");
    });

    peer.on("close", () => {
      console.warn("Peer connection closed");
    });

    peer.on("disconnected", () => {
      console.warn("Peer connection disconnected");
    });

    return () => {
      resetTracks();
      peer.destroy();
    };
  }, []);

  const handleStream = (call: MediaConnection, recipient?: string) => {
    if (!call) return;

    currentCall.current = call;
    setCallStatus("In call");

    call.on("stream", (remoteStream) => {
      if (remoteAudioRef.current) {
        api.info({
          key: callNotificationKey,
          message: (
            <CallSession
              callerName={recipient || call.metadata.name}
              onMute={(mute: boolean) => {
                remoteStream.getAudioTracks()[0].enabled = mute;
              }}
              onFinish={(duration) =>
                endCall({
                  duration,
                  sessionId: call.metadata.sessionId,
                  status: CallLogStatus.Finished,
                })
              }
            />
          ),
          ...sharedCallNotificationProps,
        });
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch((e) => {
          console.error("Error playing remote audio:", e);
        });
      }
    });

    call.on("close", () => {
      if (callStatus === "In call") {
        setCallStatus("Call ended");
      }
    });
  };

  const retryCall = () => {
    if (!peerInstance || !currentCall.current || !localAudioRef.current) return;

    const metadata = currentCall.current.metadata;

    const call = peerInstance.call(
      getPeerId(metadata.receiverId),
      localAudioRef.current.srcObject as MediaStream,
      {
        metadata,
      }
    );

    handleStream(call);
  };

  const makeCall = async (
    receiverId: string,
    receiverName: string,
    userName: string
  ) => {
    const sessionId = v4();

    api.info({
      message: (
        <OutgoingCallSession
          autoEnd
          receiverName={receiverName}
          retryCall={retryCall}
          onFinish={(status) =>
            endCall({
              duration: 0,
              sessionId,
              status: status || CallLogStatus.Cancelled,
            })
          }
        />
      ),
      ...sharedCallNotificationProps,
    });

    const failedAttempt = () => {
      closeCallNotification();
      return false;
    };

    if (!peerInstance) return failedAttempt();

    // save call log
    const resp: any = await makeCallReq({ receiverId, sessionId });

    const { callId } = (resp.data as MakeCallResp) || {};

    if (!callId) {
      return failedAttempt();
    }

    const remotePeerId = getPeerId(receiverId);

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }

        const call = peerInstance.call(remotePeerId, stream, {
          metadata: {
            name: userName,
            sessionId,
            callerId: userId,
            receiverName,
            receiverId,
          },
        });
        handleStream(call, receiverName);
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  };

  const endCall = (payload: IEndCallSession) => {
    if (currentCall.current) {
      currentCall.current.close();
      currentCall.current = null;
      setCallStatus("Call ended");
      closeCallSession(payload);
    }
  };

  function answerCall(incomingCall: MediaConnection) {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }
        incomingCall.answer(stream);
        handleStream(incomingCall);
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
        setCallStatus("Call failed");
      });
  }

  function closeCallNotification() {
    api.destroy(callNotificationKey);
  }

  const rejectCall = (incomingCall: MediaConnection) => {
    const sessionId = incomingCall.metadata.sessionId;
    incomingCall.close();
    setCallStatus("Call rejected");
    closeCallSession({
      duration: 0,
      sessionId,
      status: CallLogStatus.Declined,
    });
  };

  return useMemo(
    () => ({
      makeCall,
      status: callStatus,
      contextHolder: (
        <div>
          {contextHolder}
          <audio muted ref={localAudioRef} />
          <audio ref={remoteAudioRef} />
        </div>
      ),
    }),
    [!!peerInstance, callStatus]
  );
};

export default usePeer;
