module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            title: String,
            description: String,
            published: Boolean,
            createdAt: {type: Date, default: Date.now()},
            updatedAt: {type: Date, default: Date.now()},
            typeContent: String,
            time_interval: String,
            id_user: { type: String, required: true }
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Tutorial = mongoose.model("tutorial", schema);
    return Tutorial;
};