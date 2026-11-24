
import { Counter } from "counterapi";

const counter = new Counter({
  workspace: process.env.COUNTER_WORKSPACE,
  accessToken: process.env.COUNTER_API_TOKEN,
});

const COUNTER_NAME = process.env.COUNTER_NAME;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const action = req.query.action;

  try {
    let result;

    if (action === "visit") {
      result = await counter.up(COUNTER_NAME);
    } else if (action === "get") {
      result = await counter.get(COUNTER_NAME);
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    return res.status(200).json({
      success: true,
      count: result.data.up_count,
    });
  } catch (error) {
    console.error("CounterAPI error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Counter service unavailable",
    });
  }
}
