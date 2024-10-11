import Peer from "peerjs";
import { useEffect, useState } from "react";
import { setLS } from "../lib/helpers/localStorage";
import { lsKeys } from "../lib/constants/localStorageKeys";

const usePeer = () => {
  const [peerInstance, setPeerInstance] = useState<Peer>()

  useEffect(() => {
    const peer = new Peer({
      config: { iceServers: [{ url: "stun:stun.l.google.com:19302" }] },
    });

    setPeerInstance(peer)

    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      setLS(lsKeys.PEER_ID, id);
    });

    peer.on("error", (err) => {
      console.error("Error establishling peer connection: ", err);
    });

    return () => {
      peer.destroy();
    };
  }, []);
}

export default usePeer