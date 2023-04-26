import { Card } from "antd";
import MessageBox from "./MessageBox";

const RequestContent = (props) => {
  return (
    <>
      <Card className="m-3 w-50">
        <MessageBox {...props} />
      </Card>
    </>
  );
};

export default RequestContent;

