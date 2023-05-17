import { Button, Card, Popconfirm, Result } from "antd";
import MessageBox from "./MessageBox";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useApproveRequestMutation,
  useDeclineRequestMutation,
} from "../api/mutationEndpoints";
import { apiResponseHandler } from "../../../app/lib/helpers/responseHandler";
import { useDispatch } from "react-redux";
import { setActiveThread, setRequestApproval } from "../slice/homeSlice";
import { IThread } from "../api/types";

const RequestContent = (props: IThread) => {
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

  const { createdAt, message } = props.messages[0];

  return (
    <>
      <MessageBox createdAt={createdAt} message={message} fromUser={false} />

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
              <Button icon={<CheckOutlined />} loading={approving} type="ghost">
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
    </>
  );
};

export default RequestContent;

