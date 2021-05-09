function main() {
  const scriptProperties = PropertiesService.getScriptProperties().getProperties();
  const {
    PIXELA_USERNAME,
    PIXELA_GRAPH_ID,
    PIXELA_TOKEN,
    SLACK_CHANNEL_ID,
    SLACK_TOKEN,
  } = scriptProperties;

  const { shouldPostMessage, text } = (() => {
    try {
      const quantity = getPixelaQuantity({
        username: PIXELA_USERNAME,
        graphID: PIXELA_GRAPH_ID,
        date: new Date(),
        token: PIXELA_TOKEN,
      });

      return quantity > 0
        ? { shouldPostMessage: false, text: "" }
        : {
            shouldPostMessage: true,
            text: `${PIXELA_GRAPH_ID}のquantityがまだ0です！`,
          };
    } catch {
      return {
        shouldPostMessage: true,
        text: `${PIXELA_GRAPH_ID}のquantityの取得に失敗しました。今日はまだ更新がない可能性があります。`,
      };
    }
  })();

  if (shouldPostMessage) {
    postSlackMessage({
      channelId: SLACK_CHANNEL_ID,
      token: SLACK_TOKEN,
      text,
    });
  }
}

const getPixelaQuantity = ({
  username,
  graphID,
  date,
  token,
}: {
  username: string;
  graphID: string;
  date: Date;
  token: string;
}): number => {
  const yyyy = date.getFullYear();
  const MM = `${date.getMonth() + 1}`.padStart(2, "0");
  const dd = `${date.getDate()}`.padStart(2, "0");
  const url = `https://pixe.la/v1/users/${username}/graphs/${graphID}/${yyyy}${MM}${dd}`;
  const headers = { "X-USER-TOKEN": token };

  const response = UrlFetchApp.fetch(url, { headers });
  const json = JSON.parse(response.getContentText());
  return Number(json.quantity);
};

const postSlackMessage = ({
  channelId,
  text,
  token,
}: {
  channelId: string;
  text: string;
  token: string;
}): void => {
  const url = "https://slack.com/api/chat.postMessage";
  const formData = {
    icon_emoji: ":warning:",
    username: "PixelaBot",
    channel: channelId,
    text,
    token,
  };
  const options = {
    method: "post" as const,
    payload: formData,
  };
  UrlFetchApp.fetch(url, options);
};
