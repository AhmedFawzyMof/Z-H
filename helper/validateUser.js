const db = require("../db/index");
const promisePool = db.promise();

export const Validate = async (req, res, next) => {
    const user = req.params.user
    const [result, _] = await promisePool.qurey("SELECT id FROM Users WHERE id = ?", user)

    const resultId = result[0].id

    if(!resultId) {
        res.json({
            success: 0,
        });
        return;
    }

    next()
}
