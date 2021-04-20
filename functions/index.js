'user-strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendNotification = functions.firestore.document("MGas_Client/{User_Id}/Notifications/{notification_id}")
    .onWrite((change, event) => {
        
      // If we set `/users/marie` to {name: "Marie"} then
      // context.params.userId == "marie"
      // ... and ...
      // change.after.data() == {name: "Marie"}


    const User_Id = event.params.User_Id;
    const notification_id = event.params.notification_id;

    console.log("we have a new Notification to",User_Id +"  |  " + notification_id);
    
    return admin.firestore().collection("MGas_Client").doc(User_Id).collection("Notifications")
    .doc(notification_id).get().then(quertResult => {

 
        const from_user_id = quertResult.data().User_ID;
        const message = quertResult.data().type;
        const ord_Id = quertResult.data().Order_iD;

        const from_data = admin.firestore().collection("MGas_Client").doc(User_Id).get();
        const to_data = admin.firestore().collection("Gas_Vendor").doc(from_user_id).get();


        return Promise.all([from_data,to_data]).then(result =>{

            const from_name = result[0].data().First_Name;
            const to_name = result[1].data().first_name;
            const token_id = result[1].data().device_token;



            console.log("Message from :  "+ from_name + "  Sent To:  " +to_name);


         

            const payload = {
                notification : {

                    title :"Order from: " + from_name,
                    body : message,
                    icon : "default",
                    click_action:"com.gas.chapel.TARGETNOTIFICATIONS"

                },
                data :{  title: "Order from: " + from_name,
                         message: message,
                         order_id: ord_Id  }
                
            };


            return admin.messaging().sendToDevice(token_id,payload).then(result => {


                console.log("Sent To:  "+token_id);


            });




        });


    });

    


    });


    ///-----Ordertracking Notification --- /////

    exports.OrderTracking = functions.firestore.document("Order_request/{Doc_id}")
    .onWrite((change, event) => {
 
        const doc_ID = event.params.Doc_id;

        return admin.firestore().collection("Order_request").doc(doc_ID).get().then(quertResult => {


            const order_st = quertResult.data().Order_status;
            const device_token1 = quertResult.data().device_token;
            const userID = quertResult.data().User_id;


            const from_data = admin.firestore().collection("MGas_Client").doc(userID).get();
            const order_data = admin.firestore().collection("Order_request").doc(doc_ID).get();

            return Promise.all([from_data,order_data]).then(result =>{

                const token_id1 = result[0].data().device_token;
                const item_name =  result[1].data().Name;
                const ordID = result[1].data().doc_id;
                const itemDesc = result[1].data().Item_desc;
                
                
                console.log("Order confirmed  "+ order_st);

            if(order_st == 1){


                const payload = {
                    notification : {
    
                        title :"Order confirmed",
                        body : item_name+" "+itemDesc,
                        icon : "default",
                        click_action:"com.gas.chapel.TARGETNOTIFICATIONS"
    
                    },
                    data :{  title: "Order confirmed",
                             message: item_name+" "+itemDesc,
                             order_id: ordID  }
                    
                };
    
    
                return admin.messaging().sendToDevice(token_id1,payload).then(result => {
    
    
                    console.log("Sent To:  "+token_id1);
                    console.log("Order confirmed");

    
                });





            }else if(order_st == 2){

                const payload = {
                    notification : {
    
                        title :"Order in transit",
                        body : item_name+" "+itemDesc,
                        icon : "default",
                        click_action:"com.gas.chapel.TARGETNOTIFICATIONS"
    
                    },
                    data :{  title: "Order in transit ",
                             message: item_name+" "+itemDesc,
                             order_id: ordID  }
                    
                };
    
    
                return admin.messaging().sendToDevice(token_id1,payload).then(result => {
    
    
                    console.log("Sent To:  "+token_id1);
                    console.log("Order in transit");

    
                });



            } if(order_st == 3){


                   const payload = {
                    notification : {
    
                        title :"Order ready for pick up",
                        body : item_name+" "+itemDesc,
                        icon : "default",
                        click_action:"com.gas.chapel.TARGETNOTIFICATIONS"
    
                    },
                    data :{  title: "Order ready for pick up",
                             message: item_name+" "+itemDesc,
                             order_id: ordID  }
                    
                };
    
    
                return admin.messaging().sendToDevice(token_id1,payload).then(result => {
    
    
                    console.log("Sent To:  "+token_id1);
                    console.log("Order in delivered");

    
                });




            } if(order_st == 12){


                
                   const payload = {
                    notification : {
    
                        title :"Order has been rejected",
                        body : item_name+" "+itemDesc,
                        icon : "default",
                        click_action:"com.gas.chapel.TARGETNOTIFICATIONS"
    
                    },
                    data :{  title: "Order has been rejected",
                             message: item_name+" "+itemDesc,
                             order_id: ordID  }
                    
                };
    
    
                return admin.messaging().sendToDevice(token_id1,payload).then(result => {
    
    
                    console.log("Sent To:  "+token_id1);
                    console.log("Order cancled");


    
                });
                

            }



            });

            


    });


    });
    ///-----Order tracking End----//// 
