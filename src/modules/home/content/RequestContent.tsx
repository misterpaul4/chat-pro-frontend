import { Button, Card, Popconfirm, Result } from "antd";
import MessageBox from "./MessageBox";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useApproveRequestMutation,
  useDeclineRequestMutation,
  useStarMessageMutation,
} from "../api/mutationEndpoints";
import { useDispatch } from "react-redux";
import { setActiveThread, setRequestApproval, setStarMessage } from "../slice/homeSlice";
import { IThread } from "../api/types";
import useApiResponseHandler from "../../../app/hooks/useApiResponseHandler";
import { messageActionType } from "../context/messageReducer";

const RequestContent = (props: IThread & { userId: string }) => {
  const apiResponseHandler = useApiResponseHandler();

  const dispatch = useDispatch();
  const [approveRequest, { isLoading: approving }] =
    useApproveRequestMutation();

  const [declineRequest, { isLoading: declining }] =
    useDeclineRequestMutation();

  const approve = async () => {
    const resp: any = await approveRequest(props.id);
    apiResponseHandler(resp, {
      onSuccess: {
        callBack: () => {
          dispatch(
            setRequestApproval({
              activeTab: "inbox",
              activeThread: { ...props, type: resp.data.type },
            })
          );
        },
      },
    });
  };

  const decline = async () => {
    const resp = await declineRequest(props.id);
    apiResponseHandler(resp, {
      onSuccess: { callBack: () => dispatch(setActiveThread(undefined)) },
    });
  };

  const [starMessage] = useStarMessageMutation();


  const onStarMessage = (messageId: string, shouldStar: boolean) => {
    starMessage({ messageId, shouldStar });
    dispatch(setStarMessage({ messageId, isStarred: shouldStar, userId: props.userId }));
  }

  const threadMessage = props.messages[0];

  return (
    <div className="p-2">
      <MessageBox
        withActions={undefined}
        payload={threadMessage}
        fromUser={false}
        senderName={
          props.users.find((user) => user.id === threadMessage.senderId)
            ?.firstName
        }
        starredBy={threadMessage.starredBy}
        onStarMessage={onStarMessage}
      />

      <Card className="d-inline-block mt-5">
        <Result
          title="You have a new request"
          subTitle="Please check before confirmation"
          extra={[
            <Popconfirm
              title="Are you sure?"
              onConfirm={approve}
              okText="Accept"
              key="accept"
            >
              <Button
                icon={<CheckOutlined />}
                loading={approving}
                type="primary"
                ghost
              >
                Accept
              </Button>
            </Popconfirm>,
            <Popconfirm
              title={
                <span>
                  Once blocked this user cannot send you <br /> another request
                  unless you unblock
                </span>
              }
              okText="Confirm"
              onConfirm={decline}
              key="block"
            >
              <Button
                icon={<CloseOutlined />}
                loading={declining}
                type="primary"
              >
                Block
              </Button>
            </Popconfirm>,
          ]}
        />
      </Card>
    </div>
  );
};

export default RequestContent;

