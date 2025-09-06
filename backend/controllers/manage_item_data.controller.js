import { itemsDB, initializeItemsDB } from "../config/database.js";

// Initialize the Items DB once
initializeItemsDB();

// Get all items
const getAllItems = async (req, res) => {
    try {
        const result = await itemsDB.allDocs({
            include_docs: true,
            startkey: "item_",
            endkey: "item_\ufff0",
        });

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No items found.",
            });
        }

        const items = result.rows.map((row) => row.doc);
        return res.status(200).json({
            status: true,
            message: "Items retrieved successfully",
            data: items,
            count: items.length,
        });
    } catch (err) {
        console.error("Error fetching items:", err);
        return res.status(500).json({
            status: false,
            message: "Internal server error while fetching items",
            error: err.message,
        });
    }
};

// Create new item
const createItem = async (req, res) => {
    
    const { item_name, default_cost_price, default_selling_price, items_per_box } = req.validatedBody;

    const docData = {
        _id: `item_${Date.now()}`,
        item_name,
        default_cost_price,
        default_selling_price,
        items_per_box
    };

    try {
        const result = await itemsDB.post(docData);

        res.status(201).json({
            status: true,
            message: "Item created successfully",
            data: { id: result.id, rev: result.rev },
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error creating item",
            error: error.message,
        });
    }
};

// Update item
const updateItem = async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    try {
        const doc = await itemsDB.get(id);

        const updateData = {
            ...doc,
            ...newData,
            _id: doc._id,
            _rev: doc._rev,
        };

        const response = await itemsDB.put(updateData);

        res.status(200).json({
            status: true,
            message: "Item successfully updated",
            data: response,
        });
    } catch (error) {
        console.error("Error updating item:", error);
        if (error.status === 404) {
            return res.status(404).json({
                status: false,
                message: "Item not found",
                error: error.message,
            });
        }
        res.status(500).json({
            status: false,
            message: "Item update failed",
            error: error.message,
        });
    }
};

// Delete item
const deleteItem = async (req, res) => {
    const id = req.params.id;

    try {
        const doc = await itemsDB.get(id);
        const response = await itemsDB.remove(doc);

        res.status(200).json({
            status: true,
            message: "Item deleted successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete item",
            error: error.message,
        });
    }
};

export { getAllItems, createItem, updateItem, deleteItem };
