function send_message(raffle_number, name, phone) {

    const user_phone_number = phone;
    const user_name = name;
    const user_raffle_number = raffle_number;

    const finErrCode = 404;
    const date = Date.now().toString();

    const serviceId = "ncp:sms:kr:283727090343:lori_gabriel_wedding";
    const secretKey = "XCU6DwtosRZgjjRb6xcUzCVWbq40O2HGa2VEtcSs";
    const accessKey = "uKwrifL55o2MV3r7GJOy";
    const my_number = "01056640679";

    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
    const url2 = `/sms/v2/services/${serviceId}/messages`;

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    axios({
        method: method,
        url: url,
        headers: {
            "Contenc-type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
        },
        data: {
            type: "SMS",
            countryCode: "82",
            from: my_number,
            // 원하는 메세지 내용
            content: `${user_name}님의 행운번호는 ${user_raffle_number}번 입니다.`,
            messages: [
                // 신청자의 전화번호
                { to: `${user_phone_number}`, },],
        },
    }).then(res => {
        console.log(res.data);
    })
        .catch(err => {
            console.log(err);
        })
    return finErrCode;
}