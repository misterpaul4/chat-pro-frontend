import { createContext } from "react";
import { TCallStatus } from "../../../app/lib/types/peertypes";

export interface ICallState {
  status: TCallStatus
  makeCall: (receiverId: string, receiverName: string, userName: string, callerId: string) => void
}

const initialValue: ICallState = {
  makeCall: (receiverId: string, receiverName: string, userName: string, callerId: string) => { },
  status: 'Idle'
};


const callContext = createContext(initialValue);

export default callContext
