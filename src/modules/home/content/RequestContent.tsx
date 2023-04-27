import { Button, Card, Popconfirm, Result } from "antd";
import MessageBox from "./MessageBox";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useApproveRequestMutation,
  useDeclineRequestMutation,
} from "../api/mutationEndpoints";
import { apiResponseHandler } from "../../../app/lib/helpers/responseHandler";
import { useDispatch } from "react-redux";
import { setActiveContact, setRequestApproval } from "../slice/homeSlice";
import { IContact } from "../api/types";

const RequestContent = (props) => {
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
              activeContact: resp.data as IContact,
            })
          );
        },
      },
    });
  };

  const decline = async () => {
    const resp = await declineRequest(props.id);
    apiResponseHandler(resp, {
      onSuccess: { callBack: () => dispatch(setActiveContact(undefined)) },
    });
  };

  return (
    <>
      <Card className="m-3 message-width">
        <MessageBox {...props} />
      </Card>

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
              okButtonProps={{ danger: true }}
              onConfirm={decline}
              key="block"
            >
              <Button
                icon={<CloseOutlined />}
                loading={declining}
                type="primary"
                danger
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

