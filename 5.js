const cheerio = require("cheerio");
const fetch = require("node-fetch");
const fs = require("fs-extra");
const readlineSync = require("readline-sync");
const chalk = require("chalk");
const QRCode = require("qrcode");
const delay = require("delay");
const sender = (text) =>
  new Promise((resolve, reject) => {
    var formdata = new FormData();
    formdata.append("number", "0895381587961");
    formdata.append("message", text);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:8000/send-message", requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
const base64 = (text) =>
  new Promise((resolve, reject) => {
    fetch("https://www.base64encode.org/", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua":
          '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        Referer: "https://www.base64encode.org/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `input=${text}&charset=UTF-8&separator=lf`,
      method: "POST",
    })
      .then((response) => response.text())
      .then((text) => {
        const $ = cheerio.load(text);
        const result = $("#output").text();
        resolve(result);
      })
      .catch((error) => reject(error));
  });
const trxtes = ({ cart_id, cookie, basedecode }) =>
  new Promise((resolve, reject) => {
    fetch(
      `https://artatix.co.id/page_event_cart_form?id=${cart_id}&qty=${basedecode}&lang=id`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9",
          "sec-ch-ua":
            '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          Cookie: cookie,
        },
        body: null,
        method: "GET",
      }
    )
      .then((res) => res.text())
      .then((text) => {
        const $ = cheerio.load(text);
        const trans_id = $("input[name=trans_id]").attr("value");
        const cst_id = $("input[name=cst_id]").attr("value");
        const cart_id = $("input[name=cart_id]").attr("value");
        const event_id = $("input[name=event_id]").attr("value");
        const link_event = $("input[name=link_event]").attr("value");
        const token = $("input[name=token]").attr("value");

        const data = {
          trans_id: trans_id,
          cst_id: cst_id,
          cart_id: cart_id,
          event_id: event_id,
          link_event: link_event,
          token: token,
        };
        resolve(data);
      })
      .catch((err) => reject(err));
  });
const getId = (url) =>
  new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "sec-ch-ua":
          '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "cross-site",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "Referrer-Policy": "origin",
      },
      body: null,
      method: "GET",
    })
      .then(async (text) => {
        const cookie = await text.headers.get("set-cookie").split(";")[0];
        const datatext = await text.text();
        const token = await datatext.split(`"tkn_err": '`)[1].split("'")[0];
        const $ = cheerio.load(datatext);
        const cart_id = $("input[name=cart_id]").attr("value");
        const cart_qty = $("input[name=cart_qty]").attr("value");
        const tkt_id = $("input[name=tkt_id]").attr("value");
        const event_id = $("input[name=event_id]").attr("value");
        const data = {
          cart_id: cart_id,
          cart_qty: cart_qty,
          tkt_id: tkt_id,
          event_id: event_id,
          token: token,
          cookie: cookie,
        };
        resolve(data);
      })
      .catch((err) => reject(err));
  });
const paytiket = ({
  cart_id,
  tkt_id,
  event_id,
  token,
  cookie,
  cart_qty,
  basedecode,
}) =>
  new Promise((resolve, reject) => {
    fetch("https://artatix.co.id/page_event_cart_proses.php", {
      method: "POST",
      headers: {
        Host: "artatix.co.id",
        "Content-Length": "80",
        "Sec-Ch-Ua": '"Chromium";v="111", "Not(A:Brand";v="8"',
        Accept: "/",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Ch-Ua-Mobile": "?0",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5563.111 Safari/537.36",
        "Sec-Ch-Ua-Platform": '"Windows"',
        Origin: "https://artatix.co.id",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "close",
        Cookie: cookie,
      },
      body: new URLSearchParams({
        tkt_id: tkt_id,
        cart_id: cart_id,
        event_id: event_id,
        cart_qty: cart_qty,
        tkn_err: token,
      }),
    })
      .then((res) => res.text())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
const Payfinal = ({
  qty,
  cst_name_utama,
  cst_identity_utama,
  cst_no_id_utama,
  cst_email_utama,
  cst_notelp_utama,
  cst_name1,
  cst_identity1,
  cst_no_id1,
  cst_email1,
  cst_notelp1,
  voucher_code,
  trans_id,
  cst_id,
  cart_id,
  event_id,
  link_event,
  token,
  cookie,
  basedecode,
}) =>
  new Promise((resolve, reject) => {
    fetch("https://artatix.co.id/page_event_cart_form_proses.php", {
      method: "POST",
      headers: {
        Host: "artatix.co.id",
        "Cache-Control": "max-age=0",
        "Sec-Ch-Ua": '"Chromium";v="111", "Not(A:Brand";v="8"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Upgrade-Insecure-Requests": "1",
        Origin: "https://artatix.co.id",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5563.111 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document",
        Referer: `https://artatix.co.id/page_event_cart_form?id=${cart_id}&qty=${basedecode}&lang=id`,
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "close",
        Cookie: cookie,
      },
      redirect: "manual",
      body: new URLSearchParams({
        qty: qty,
        cst_name_utama: cst_name_utama,
        cst_identity_utama: cst_identity_utama,
        cst_no_id_utama: cst_no_id_utama,
        cst_email_utama: cst_email_utama,
        cst_notelp_utama: cst_notelp_utama,
        cst_name1: cst_name1,
        cst_identity1: cst_identity1,
        cst_no_id1: cst_no_id1,
        cst_email1: cst_email1,
        cst_notelp1: cst_notelp1,
        cst_name2: cst_name1,
        cst_identity2: "KTP",
        cst_no_id2: cst_no_id1,
        cst_email2: cst_email1,
        cst_notelp2: cst_notelp1,
        cst_name3: cst_name1,
        cst_identity3: "KTP",
        cst_no_id3: cst_no_id1,
        cst_email3: cst_email1,
        cst_notelp3: cst_notelp1,
        cst_name4: cst_name1,
        cst_identity4: "KTP",
        cst_no_id4: cst_no_id1,
        cst_email4: cst_email1,
        cst_notelp4: cst_notelp1,
        cst_name5: cst_name1,
        cst_identity5: "KTP",
        cst_no_id5: cst_no_id1,
        cst_email5: cst_email1,
        cst_notelp5: cst_notelp1,
        voucher_code: "",
        trans_id: trans_id,
        cst_id: cst_id,
        cart_id: cart_id,
        event_id: event_id,
        link_event: link_event,
        token: token,
      }),
    })
      .then((res) => res.headers.get("location"))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
const getQr = ({ cart_id, tkt_id, event_id, token, cookie }) =>
  new Promise((resolve, reject) => {
    fetch("https://checkout.xendit.co/api/payment_methods", {
      headers: {
        accept: "/",
        "accept-language": "en-US,en;q=0.9",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnZvaWNlX2lkIjoiNjQyZGJhMDVkYTFhZmI0YzJmMTYzNjU0IiwiaWF0IjoxNjgwNzE4NDIzLCJleHAiOjE2ODA3MTkzMjN9.rGExMKIKx4KnQ61IHdtgJi4NCsqDH_gYvnn6zRnnE08",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Referer: "https://checkout.xendit.co/",
        "Referrer-Policy": "strict-origin",
      },
      body: '{"payment_method":{"type":"QR_CODE","reusability":"ONE_TIME_USE"}}',
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
(async () => {
  var qty = 5;
  var decode = await base64(qty);
  var linkEvent = "https://artatix.co.id/event/buzzyouthfest2023";
  var input = readlineSync.question(
    chalk.yellowBright(`[ INFO ] `) + chalk.greenBright("Input Txt : ")
  );

  var dataakun = fs.readFileSync(input, "utf8");
  var Fullname = dataakun.split("|")[0];
  var Datanik = dataakun.split("|")[1];
  var Email = dataakun.split("|")[3];
  var Number = dataakun.split("|")[2];
  console.log({
    fullname: Fullname,
    Nik: Datanik,
    number: Number,
    email: Email,
  });
  let datarepay;
  do {
    await delay(1000);
    try {
      const data = await getId(linkEvent);
      const datat = {
        tkt_id: data.tkt_id,
        cart_id: data.cart_id,
        event_id: data.event_id,
        cart_qty: qty,
        tkn_err: data.token,
      };
      const dataaccount = {
        cart_id: data.cart_id,
        cart_qty: qty,
        tkt_id: data.tkt_id,
        event_id: data.event_id,
        token: data.token,
        cookie: data.cookie,
        basedecode: decode,
      };
      //   fs.appendFileSync("data.html", data);
      datarepay = await paytiket(dataaccount);
      console.log(datarepay);
      if (datarepay.includes("success")) {
        const datafinal = await trxtes(dataaccount);
        const akhirpayment = {
          qty: data.cart_qty,
          cst_name_utama: Fullname,
          cst_identity_utama: "KTP",
          cst_no_id_utama: Datanik,
          cst_email_utama: Email,
          cst_notelp_utama: Number,
          cst_name1: Fullname,
          cst_identity1: "KTP",
          cst_no_id1: Datanik,
          cst_email1: Email,
          cst_notelp1: Number,
          cst_name2: Fullname,
          cst_identity2: "KTP",
          cst_no_id2: Datanik,
          cst_email2: Email,
          cst_notelp2: Number,
          cst_name3: Fullname,
          cst_identity3: "KTP",
          cst_no_id3: Datanik,
          cst_email3: Email,
          cst_notelp3: Number,
          cst_name4: Fullname,
          cst_identity4: "KTP",
          cst_no_id4: Datanik,
          cst_email4: Email,
          cst_notelp4: Number,
          cst_name5: Fullname,
          cst_identity5: "KTP",
          cst_no_id5: Datanik,
          cst_email5: Email,
          cst_notelp5: Number,
          voucher_code: "",
          trans_id: datafinal.trans_id,
          cst_id: datafinal.cst_id,
          cart_id: datafinal.cart_id,
          event_id: datafinal.event_id,
          link_event: datafinal.link_event,
          token: datafinal.token,
          cookie: data.cookie,
          basedecode: decode,
        };
        await delay(2000);
        let link;
        do {
          link = await Payfinal(akhirpayment);
        } while (!link);
        console.log(
          chalk.yellowBright(`[ INFO ] `) +
            chalk.greenBright("Link Pembayaran  " + link)
        );
        console.log(await sender(link));
      } else {
        console.log(datarepay);
      }
    } catch (error) {
      console.log("ada Kesalahan");
    }
  } while (!datarepay || !datarepay.includes("success"));
})();
