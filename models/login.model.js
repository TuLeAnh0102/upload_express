module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            username: String,
            password: String,
            loginAt: { type: Date, default: Date.now },
            logoutAt: { type: Date, default: Date.now },
            action: { type: String, default: 'System' }
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Login = mongoose.model("login", schema);
    return Login;
}