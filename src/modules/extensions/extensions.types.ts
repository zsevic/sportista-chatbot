type PostbackBody = {
  postback: {
    payload: string;
  };
};

type TextMessageBody = {
  message: {
    text: string;
  };
};

export type MessageBody = PostbackBody | TextMessageBody;
