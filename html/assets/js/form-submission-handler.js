var googleSubmitBtn = $('#google-submit');
var snackbar = $('#snackbar');

var inputKrName = $('#krName');
var inputEngName = $('#engName');
var inputPhone = $('#phone');
var inputEmail = $('#email');

var inputGuest;
var inputAttending;

var query = function (sql, sheetName, callback) {
    var myKey = '1wSr4dvyzcSzVWlCqQiaXPUyT3HTusPvFrIdrub_vPOE';
    var url = 'https://docs.google.com/spreadsheets/d/'+myKey+'/gviz/tq?',
        params = {
            tq: encodeURIComponent(sql),
            sheet: encodeURIComponent(sheetName),
            tqx: 'responseHandler:' + callback
        },
        qs = [];
    for (var key in params) {
        qs.push(key + '=' + params[key]);
    }
    url += qs.join('&');
    return jsonp(url); // Call JSONP helper function
}

var jsonp = function (url) {
    var script = window.document.createElement('script');
    script.async = true;
    script.src = url;
    script.onerror = function () {
        alert('Can not access JSONP file.')
    };
    var done = false;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState ===
            'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            if (script.parentNode) {
                return script.parentNode.removeChild(script);
            }
        }
    };
    window.document.getElementsByTagName('head')[0].appendChild(script);
};

var my_callback = function (data) {
    // 입력중..
    isLoading(true);

    var raffleNumber = data.table.rows[0]['c'][0].v + 1;
    $.ajax({
        type: "GET",
        url: "https://script.google.com/macros/s/AKfycbyhZgPBicmrsMawOxjoAsNBkUbZ5CjTtHEJYBtBz3Hq69zspchgY4ir6hIHAI18I_E/exec",
        data: {
            "kr_name": inputKrName.val(),
            "en_name": inputEngName.val(),
            "phone": inputPhone.val(),
            "email": inputEmail.val(),
            "guest": inputGuest,
            "attending": inputAttending,
            "raffle_number": raffleNumber
        },
        success: function (response) {
            if (inputAttending === 'Yes') {
                sendSms(raffleNumber);
            }

            isLoading(false);

            snackbar.html('RSVP completed!').addClass('show');
            setTimeout(function () {
                snackbar.removeClass('show');
            }, 3000);

            //값 비워주기
            // inputName.val('');
            // inputAge.val('');
            // inputArea.val('');
        },
        error: function (request, status, error) {
            isLoading(false);
            console.log("code:" + request.status + "\n" + "error:" + error);
            console.log(request.responseText);
        }
    });
}

function sendSms(raffleNumber) {
    console.log("Your raffle number is " + raffleNumber);
}

function isLoading(status){
    if(status){
        $('html, body').addClass('wait');
        googleSubmitBtn.attr('disabled', true).html('Sending...');
    } else {
        $('html, body').removeClass('wait');
        googleSubmitBtn.attr('disabled', false).html('Sent!');
    }
}

function isInputEmpty(){

    if (inputKrName.val() === '' || inputEngName.val() === '' || inputEmail.val() === '') {
        alert('빈칸이 있습니다!');
        return true;
    }

    if (document.querySelector('input[name="guest"]:checked') == null
        || document.querySelector('input[name="attending"]:checked') == null) {
        alert('모든 항목을 선택해주세요!');
        return true
    }

    inputGuest = document.querySelector('input[name="guest"]:checked').value;
    inputAttending = document.querySelector('input[name="attending"]:checked').value;

    return false;
}

$('#google-submit').click(function () {

    //빈값 체크
    if (isInputEmpty()) { return; }

    query('SELECT H ORDER BY H DESC LIMIT 1', 'Sheet1', 'my_callback');
});