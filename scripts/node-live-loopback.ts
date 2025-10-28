import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import fetch from "cross-fetch";

import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});
const live = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const connection = deepgram.listen.live({
    model: "nova-3",
  });

  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log("Connection opened.");

    fetch("https://stream.live.vc.bbcmedia.co.uk/bbc_world_service")
      .then((r) => r.body)
      .then((res) => {
        res?.on("readable", () => {
          connection.send(res.read());
        });
      });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      console.log("transcript", data.channel.alternatives[0].transcript);
    });

    connection.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.warn("metadata", data);
    });
    connection.on(LiveTranscriptionEvents.SpeechStarted, (data) => {
      console.log("speech start", data);
    });
    connection.on(LiveTranscriptionEvents.UtteranceEnd, (data) => {
      console.log("sentence  end", data);
    });
    connection.on(LiveTranscriptionEvents.Unhandled, (error) => {
        console.error("unhandled error", error);
      },
    );
    connection.on(LiveTranscriptionEvents.Error, (error) => {
      console.error("error", error);
    });

    connection.on(LiveTranscriptionEvents.Close, () => {
      connection.finalize();
      connection.disconnect();
      console.log("Connection closed.");
    });

  });
};

live();