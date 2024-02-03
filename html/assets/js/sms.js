function send_message(raffle_number, name, phone) {

    const user_phone_number = phone;
    const user_name = name;
    const user_raffle_number = raffle_number;

    const method = "POST";
    const url = `https://5zet34y4mt.apigw.ntruss.com/SMS/v1/sendSms`;

    axios({
        method: method,
        url: url,
        headers: {
            "Content-type": "application/json; charset=utf-8",
            "x-ncp-apigw-api-key": "",
        },
        data: {
            name: user_name,
            phone: user_phone_number,
            raffleNumber: user_raffle_number
        },
    }).then(res => {
        console.log(res.data);
    })
        .catch(err => {
            console.log(err);
        })
}
