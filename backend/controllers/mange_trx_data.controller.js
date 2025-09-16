import {
  initializeTransactionsDB,
  transactionsDB,
} from "../config/database.js";

//Initializating the DB
initializeTransactionsDB();

// create new transaction
export const upsertSession = async (req, res) => {
  const { date, session, items } = req.validatedBody;

  // compute profit for each item before saving
  const enriched = items.map((i) => ({
    ...i,
    profit: (i.sell_price - i.cost_price) * i.quantity,
  }));

  const docId = `txn_${date}_${session}`;

  try {
    let existing;
    try {
      existing = await transactionsDB.get(docId);
      // merge/overwrite items
      existing.items = enriched;
      const result = await transactionsDB.put({ ...existing });
      return res
        .status(200)
        .json({ status: true, message: "Session updated", data: result });
    } catch (err) {
      if (err.status !== 404) throw err; // only ignore if not found
    }

    // create new doc if not exists
    const newDoc = { _id: docId, date, session, items: enriched };
    const result = await transactionsDB.put(newDoc);
    res
      .status(201)
      .json({ status: true, message: "Session created", data: result });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error storing session",
      error: err.message,
    });
  }
};

// fetch transactions by date
export const getSessionByDate = async (req, res) => {
  const { date, session } = req.params; // /transactions/:date/:session
  const docId = `txn_${date}_${session}`;
  try {
    const doc = await transactionsDB.get(docId);
    res
      .status(200)
      .json({ status: true, message: "Session retrieved", data: doc });
  } catch (err) {
    if (err.status === 404) {
      return res.status(200).json({
        status: true,
        message: "No transactions for this session",
        data: [], // 👈 empty array instead of error
      });
    }
    res
      .status(500)
      .json({ status: false, message: "Fetch failed", error: err.message });
  }
};

//fetch transaction by date range
export const getSessionsByRange = async (req, res) => {
  const { start, end } = req.query; // /transactions/range?start=2025-09-01&end=2025-09-07
  try {
    const result = await transactionsDB.find({
      selector: {
        date: { $gte: start, $lte: end },
      },
    });
    res.status(200).json({
      status: true,
      message: "Sessions retrieved",
      count: result.docs.length,
      data: result.docs,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching sessions",
      error: err.message,
    });
  }
};

export const deleteSession = async (req, res) => {
  const { date, session } = req.params;
  const docId = `txn_${date}_${session}`;
  try {
    const doc = await transactionsDB.get(docId);
    const result = await transactionsDB.remove(doc);
    res
      .status(200)
      .json({ status: true, message: "Session deleted", data: result });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Delete failed", error: err.message });
  }
};
