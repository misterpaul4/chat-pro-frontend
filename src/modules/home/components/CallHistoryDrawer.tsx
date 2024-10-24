import { Button, Drawer, List, Typography } from "antd";
import { useGetCallHistoryQuery } from "../api/queryEndpoints";
import Icon, { PhoneOutlined } from "@ant-design/icons";
import { useState } from "react";
import { drawerSharedProps } from "../constants/props";
import ContactAvatar from "../../../app/common/ContactAvatar";
import { IBaseUser } from "../../auth/control/types";
import { convertSecondsToTime } from "../../../app/lib/helpers/call";
import { getLastMessageTime } from "../../../app/lib/helpers/time";
import { CallLogStatus } from "../api/types";
import {
  IncomingCallIcon,
  MissedCallIcon,
  OutgoingCallIcon,
} from "../../../utils/icons";

interface IProps {
  user: IBaseUser;
}

const CallHistoryDrawer = ({ user }: IProps) => {
  const { data, isFetching, refetch } = useGetCallHistoryQuery();

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onOpen = () => {
    refetch();
    setIsOpen(true);
  };

  const getCallStatusComponent = (
    isMissedCall: boolean,
    isIncomingCall: boolean
  ) => {
    if (isMissedCall) {
      return (
        <>
          <Icon
            style={{
              color: "red",
            }}
            component={MissedCallIcon}
          />{" "}
          Missed call
        </>
      );
    }

    if (isIncomingCall) {
      return (
        <>
          <Icon
            style={{
              color: "green",
            }}
            component={IncomingCallIcon}
          />{" "}
          Incoming call
        </>
      );
    }

    return (
      <>
        <Icon
          style={{
            color: "red",
          }}
          component={OutgoingCallIcon}
        />{" "}
        Outgoing call
      </>
    );
  };

  return (
    <>
      <Button
        loading={isFetching}
        shape="circle"
        onClick={onOpen}
        icon={<PhoneOutlined className="cursor-pointer" />}
      />

      <Drawer
        {...drawerSharedProps({ title: "Call History" })}
        open={isOpen}
        width={550}
        onClose={onClose}
      >
        <List
          dataSource={data?.data}
          size="large"
          renderItem={(item) => {
            let recipient: IBaseUser;
            let isMissedCall = false;
            let isIncomingCall = false;

            if (item.callFromId === user.id) {
              recipient = item.callTo;
            } else {
              recipient = item.callFrom;
              isMissedCall = item.status === CallLogStatus.NotAnswered;
              isIncomingCall = true;
            }

            return (
              <List.Item
                key={item.id}
                actions={[<span>{getLastMessageTime(item.createdAt)}</span>]}
              >
                <div className="d-flex">
                  <ContactAvatar name={recipient.firstName} />{" "}
                  <div
                    className={`ms-3 text-capitalize ${
                      isMissedCall ? "text-danger" : ""
                    }`}
                  >
                    {recipient.firstName} {recipient.lastName}
                    <br />
                    <small>
                      {getCallStatusComponent(isMissedCall, isIncomingCall)}
                    </small>
                    {!!item.duration && (
                      <div>
                        <small>{convertSecondsToTime(item.duration)}</small>
                      </div>
                    )}
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </Drawer>
    </>
  );
};

export default CallHistoryDrawer;
