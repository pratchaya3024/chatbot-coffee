const functions = require("firebase-functions");
const request = require("request-promise");
const config = require("./config.json");

//[1]เพิ่ม dialogflow-fulfillment library
//[7] เพิ่ม Payload
const { WebhookClient, Payload } = require("dialogflow-fulfillment");

//[8] เพิ่ม firebase-admin และ initial database
const firebase = require("firebase-admin");
firebase.initializeApp({
  credential: firebase.credential.applicationDefault(),
  databaseURL: config.databaseURL
});
var phoneNumber = "";
var db = firebase.firestore();
//ตั้งค่า region และปรับ timeout และเพิ่ม memory
const region = "asia-east2";
const runtimeOptions = {
  timeoutSeconds: 4,
  memory: "2GB"
};

//ทำ webhook request url
exports.webhook = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    console.log("LINE REQUEST BODY", JSON.stringify(req.body));

    //[2] ประกาศ ตัวแปร agent
    const agent = new WebhookClient({ request: req, response: res });

    //[4] ทำ function view menu เพื่อแสดงผลบางอย่างกลับไปที่หน้าจอของ bot
    const viewMenu = async agent => {
      //[5] เพิ่ม flex message
      //[9] แก้ไข flex message ให้ dynamic ได้
      const flexMenuMsg = {
        "type": "flex",
        "altText": "Flex Message",
        "contents": {
          "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "สามารถเลือกเมนูร้อน ได้ตามนี้เลยค่ะ"
                  }
                ]
              },
              "hero": {
                "type": "image",
                "url": "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?cs=srgb&dl=art-blur-cappuccino-close-up-302899.jpg&fm=jpg",
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Hot Drinks",
                    "size": "xl",
                    "weight": "bold",
                    "wrap": true
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Hot Americano",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Hot Americano",
                          "text": "Hot Americano 55บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "55 บาท",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Hot Espresso",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Hot Espresso",
                          "text": "Hot Espresso 60บาท"
                        },
                        "wrap": true
                      },
                      {
                        "type": "text",
                        "text": "60 บาท",
                        "size": "md",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Hot Cappuchino",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Hot Cappuchino",
                          "text": "Hot Cappuchino 65 บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "65 บาท",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Hot Mocca",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Hot Mocca",
                          "text": "Hot Mocca 65บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "65 บาท",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Hot Coco",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Hot Coco",
                          "text": "Hot Coco 70บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "70 บาท",
                        "align": "end"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "bubble",
              "direction": "ltr",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "สามารถเลือกเมนูเย็น ได้ตามนี้เลยค่ะ"
                  }
                ]
              },
              "hero": {
                "type": "image",
                "url": "https://images.pexels.com/photos/1162455/pexels-photo-1162455.jpeg?cs=srgb&dl=two-brown-liquid-on-glass-with-ice-1162455.jpg&fm=jpg",
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Cold Drinks",
                    "size": "xl",
                    "weight": "bold",
                    "wrap": true
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Cold Americano",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Cold Americano",
                          "text": "Cold Americano 65บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "65 บาท",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Cold Espresso",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Cold Espresso",
                          "text": "Cold Espresso 70บาท"
                        },
                        "wrap": true
                      },
                      {
                        "type": "text",
                        "text": "70 บาท",
                        "size": "md",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Cold Cappuchino",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Cold Cappuchino",
                          "text": "Cold Cappuchino 75บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "75 บาท",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Cold Mocca",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Cold Mocca",
                          "text": "Cold Mocca 75บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "75 บาท",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Cold Coco",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Cold Coco",
                          "text": "Cold Coco 80บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "80 บาท",
                        "align": "end"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "bubble",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "สามารถเลือกเมนูปั่น ได้ตามนี้เลยค่ะ"
                  }
                ]
              },
              "hero": {
                "type": "image",
                "url": "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?cs=srgb&dl=blur-cappuccino-chocolate-close-up-230588.jpg&fm=jpg",
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Frappe Drinks",
                    "size": "xl",
                    "weight": "bold",
                    "wrap": true
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Frappe Americano",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Frappe Americano",
                          "text": "Frappe Americano 75บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "75 บาท",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Frappe Espresso",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Frappe Espresso",
                          "text": "Frappe Espresso 80บาท"
                        },
                        "wrap": true
                      },
                      {
                        "type": "text",
                        "text": "80 บาท",
                        "size": "md",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Frappe Cappuchino",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Frappe Cappuchino",
                          "text": "Frappe Cappuchino 85บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "85 บาท",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Frappe Mocca",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Frappe Mocca",
                          "text": "Frappe Mocca 85บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "85 บาท",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Frappe Coco",
                        "size": "sm",
                        "weight": "bold",
                        "action": {
                          "type": "message",
                          "label": "Frappe Coco",
                          "text": "Frappe Coco 90บาท"
                        }
                      },
                      {
                        "type": "text",
                        "text": "90 บาท",
                        "align": "end"
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      }

      //[6] ปรับการตอบกลับ ให้ตอบกลับผ่าน flex message ด้วย Payload
      //[10] ปรับให้ต่อ database ได้ ตอบกลับผ่าน flex message ด้วย Payload
      // return db
      //   .collection("Menu")
      //   .get()
      //   .then(snapshot => {
      //     snapshot.docs.forEach(doc => {
      //       const data = doc.data();
      //       let itemData = {
      //         type: "box",
      //         layout: "baseline",
      //         contents: [
      //           {
      //             type: "text",
      //             text: data.name,
      //             margin: "sm",
      //             weight: "bold",
      //             action: {
      //               type: "message",
      //               label: data.name,
      //               text: data.name
      //             }
      //           },
      //           {
      //             type: "text",
      //             text: data.type,
      //             align: "center"
      //           },
      //           {
      //             type: "text",
      //             text: data.price + " บาท",
      //             size: "sm",
      //             align: "end",
      //             color: "#AAAAAA"
      //           },

      //         ]
      //       };
      //       flexMenuMsg.contents.body.contents[1].contents.push(itemData);
      //     });

        //   const payloadMsg = new Payload("LINE", flexMenuMsg, {
        //     sendAsMessage: true
        //   });
        //   return agent.add(payloadMsg);
        // })
        // .catch(error => {
        //   return response.status(500).send({
        //     error: error
        //   });
        // });
        const payloadMsg = new Payload("LINE", flexMenuMsg, {
          sendAsMessage: true
        });
        return agent.add(payloadMsg);
      };

    const phoneSet = async agent => {
      // console.log('phone ==> ', JSON.stringify(req.body.queryResult.parameters.phone))
      if (typeof req.body.queryResult.parameters.phone != 'undefined') {
        phoneNumber = req.body.queryResult.parameters.phone;
      }
      else {
        phoneNumber = "";
      }
      console.log("after set phoneNumber", phoneNumber)
      return "Save Phone Number";
    }

    //[12]ทำ method เพื่อรองรับ intent view-menu-select - yes
    const viewMenuSelect = async agent => {
      //[13] ดึงข้อมูล source และ userId ขึ้นมาไว้  
      let source = req.body.originalDetectIntentRequest.source;
      if (typeof source === "undefined") {
        source = "";
      }

      //ดึงข้อมูล userId
      let userId = "";
      if (source === "line") {
        userId =
          req.body.originalDetectIntentRequest.payload.data.source.userId;
      }

      //ดึงข้อมูลจาก parameters ขึ้นมาแสดง
      const coffee = req.body.queryResult.parameters.coffee;
      const type = req.body.queryResult.parameters.type;
      const total = req.body.queryResult.parameters.total;
      const price = req.body.queryResult.parameters.price;
      const priceSum = (parseInt(price) * total); 
      console.log("phoneNumber in viewMenuSelect ==> ", JSON.stringify(phoneNumber))
      //[14] ดึง orderNo จาก database ขึ้นมาแสดง
      let orderNo = await db
        .collection("Order")
        .get()
        .then(snapshot => {
          return snapshot.size;
        });

      orderNo++;
      const orderNoStr = orderNo.toString().padStart(4, "0");
      const currentDate = Date.now();

      //[15] บันทึกข้อมูลลง database
      return db
        .collection("Order")
        .doc()
        .set({
          timestamp: currentDate,
          total: total,
          type: type,
          coffee: coffee,
          userId: userId,
          source: source,
          orderNo: orderNo,
          phone: phoneNumber,
          priceSum: (parseInt(price) * total),
          status: 0,
        })
        .then(snapshot => {
          //[16] เพิ่ม flex เพื่อความสวยงาม
          let flexMenuMsg = {
            type: "flex",
            altText: "Flex Message",
            contents: {
              type: "bubble",
              direction: "ltr",
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "Order Number",
                    align: "center",
                    weight: "bold"
                  },
                  {
                    type: "text",
                    text: `${orderNoStr}`,
                    size: "3xl",
                    align: "center",
                    weight: "bold"
                  },
                  {
                    type: "text",
                    text: "รายการ",
                    size: "lg",
                    weight: "bold"
                  }
                ]
              },
              footer: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "พิเศษช่วงเปิดร้าน เดือนนี้กินฟรี\nกรุณารอสักครู่ เมื่อกาแฟของคุณพร้อมแล้ว\nเราจะมีข้อความแจ้งเตือนไปถึงคุณ",
                    size: "md",
                    align: "center",
                    gravity: "center",
                    weight: "regular",
                    wrap: true
                  }
                ]
              }
            }
          };
          flexMenuMsg.contents.body.contents.push({
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: `${type}`,
                size: "md",
                weight: "regular"
              },
              {
                type: "text",
                text: `${total} แก้ว`,
                size: "md",
                align: "center",
                weight: "regular"
              },
              {
                type: "text",
                text: `${priceSum} บาท`,
                size: "md",
                align: "end",
                weight: "regular"
              }
            ]
          },
          {
            type: "text",
            text: `${coffee}`
          });

          const payloadMsg = new Payload("LINE", flexMenuMsg, {
            sendAsMessage: true
          });

          //[17] ส่ง notify หาผู้ใช้งาน
          const notifyMsg = `มี Order No:${orderNoStr}\n${coffee} ${type} ${total} แก้ว ราคา ${priceSum} บาท`;
          lineNotify(notifyMsg);
          return agent.add(payloadMsg);
        })
        .catch(error => {
          return agent.add(JSON.stringify(error));
        });
    };

    //[3] ทำ intent map เข้ากับ function
    let intentMap = new Map();
    intentMap.set("phone-no", phoneSet);
    var phone = intentMap.set("phone-no", phoneSet);
    intentMap.set("view-menu", viewMenu);
    //[11] เพิ่ม intentMap view-menu-select - yes
    intentMap.set("view-menu-select - yes", viewMenuSelect);
    agent.handleRequest(intentMap);

    //[0] ดึงข้อมูลจาก request message ที่มาจาก LINE
    //const replyToken = req.body.events[0].replyToken;
    // const messages = [
    //   {
    //     type: "text",
    //     text: req.body.events[0].message.text //ดึง message ที่ส่งเข้ามา
    //   },
    //   {
    //     type: "text",
    //     text: JSON.stringify(req.body) //ลองให้พ่น สิ่งที่่ LINE ส่งมาให้ทั้งหมดออกมาดู
    //   }
    // ];

    // //ยิงข้อความกลับไปหา LINE (ส่ง response กลับไปหา LINE)
    // return lineReply(replyToken, messages);
  });

//ทำตัว Monitor เวลา  มีการแก้ไขที่ Order Collection
exports.dbMonitor = functions
  .region(region)
  .runWith(runtimeOptions)
  .firestore.document("Order/{Id}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();
    //ส่ง flex message เพื่อเรียกลูกค้ามารับกาแฟ
    if (previousValue.status === 0 && newValue.status === 1) {
      const orderNoStr = newValue.orderNo.toString().padStart(4, "0");
      let flexLineOrderMsg = {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "bubble",
          direction: "ltr",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "Order Number",
                align: "center",
                weight: "bold"
              },
              {
                type: "text",
                text: `${orderNoStr}`,
                size: "3xl",
                align: "center",
                weight: "bold"
              },
              {
                type: "text",
                text: "รายการ",
                size: "lg",
                weight: "bold"
              }
            ]
          },
          footer: {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: `รายการกาแฟพร้อมเสิร์ฟ ท่านสามารถมารับกาแฟได้ที่จุดรับของ\nขอบคุณค่ะ`,
                size: "md",
                align: "center",
                gravity: "center",
                weight: "regular",
                wrap: true
              }
            ]
          }
        }
      };

      flexLineOrderMsg.contents.body.contents.push({
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: `${newValue.type}`,
            size: "md",
            weight: "regular"
          },
          {
            type: "text",
            text: `${newValue.total} แก้ว`,
            size: "md",
            align: "center",
            weight: "regular"
          },
          {
            type: "text",
            text: `${newValue.priceSum} บาท`,
            size: "md",
            align: "end",
            weight: "regular"
          }
        ]
      },
      {
        type: "text",
        text: `${newValue.coffee}`
      }
      );
      return linePush(newValue.userId, [flexLineOrderMsg]);
    }
    return null;
  });

//function สำหรับ reply กลับไปหา LINE โดยต้องการ reply token และ messages (array)
const lineReply = (replyToken, messages) => {
  const body = {
    replyToken: replyToken,
    messages: messages
  };
  return request({
    method: "POST",
    uri: `${config.lineMessagingApi}/reply`,
    headers: config.lineHeaders,
    body: JSON.stringify(body)
  });
};

//function สำหรับยิง line notify
const lineNotify = msg => {
  return request({
    method: "POST",
    uri: "https://notify-api.line.me/api/notify",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + config.notifyToken
    },
    form: {
      message: msg
    }
  });
};

//function สำหรับ push ข้อความไปหาผู้ใช้งาน
const linePush = (to, messages) => {
  var body = {
    to: to,
    messages: messages
  };
  return request({
    method: "POST",
    uri: `${config.lineMessagingApi}/push`,
    headers: config.lineHeaders,
    body: JSON.stringify(body)
  });
};