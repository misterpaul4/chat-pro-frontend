import { List, Space, Typography } from "antd";
import { IChatRequest } from "../../api/types";
import { capitalize } from "../../../../utils/strings";
import { useDispatch } from "react-redux";
import { setActiveContact } from "../../slice/homeSlice";
import { hoverColor } from "../../../../settings";

interface IProps {
  list: IChatRequest[];
  activeContactId?: string;
}

const SideBarRequestBody = ({ list, activeContactId }: IProps) => {
  const dispatch = useDispatch();
  return (
    <List
      className="border-top border-bottom sidebar-message-container"
      dataSource={list}
      renderItem={(item: IChatRequest) => {
        const { firstName, lastName, email } = item.sender;
        const message = item.message;
        return (
          <List.Item
            className="cursor-pointer sidebar-message-item p-3"
            onClick={() => dispatch(setActiveContact(item))}
            style={{
              backgroundColor: item.id === activeContactId ? hoverColor : "",
            }}
          >
            <Space direction="vertical">
              <Typography.Paragraph ellipsis={{ rows: 2 }} className="m-0">
                <Space>
                  <strong>{capitalize(firstName)}</strong>
                  <strong>{capitalize(lastName)}</strong>
                  {`(${email})`}
                </Space>
              </Typography.Paragraph>

              <Typography.Paragraph ellipsis={{ rows: 3 }}>
                {message}
              </Typography.Paragraph>
            </Space>
          </List.Item>
        );
      }}
    />
  );
};

export default SideBarRequestBody;

