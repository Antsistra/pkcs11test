var pkcs11js = require("pkcs11js");

var pkcs11 = new pkcs11js.PKCS11();

try {
  // Load the PKCS#11 library
  pkcs11.load("libykcs11.dll");
  pkcs11.C_Initialize();

  // Getting info about PKCS#11 Module
  var module_info = pkcs11.C_GetInfo();
  console.log("module_info", module_info);

  // Getting list of slots
  var slots = pkcs11.C_GetSlotList(true);
  console.log("slots", slots);

  // Check if there are available slots
  if (slots.length === 0) {
    throw new Error("No available slots found.");
  }

  var slot = slots[0];
  console.log("slot", slot);

  // Getting info about slot
  var slot_info = pkcs11.C_GetSlotInfo(slot);
  console.log("slot_info", slot_info);

  // Getting info about token
  var token_info = pkcs11.C_GetTokenInfo(slot);
  console.log("token_info", token_info);

  // Getting info about Mechanism
  var mechs = pkcs11.C_GetMechanismList(slot);
  console.log("mechs", mechs);

  var mech_info = pkcs11.C_GetMechanismInfo(slot, mechs[0]);
  console.log("mech_info", mech_info);

  var session = pkcs11.C_OpenSession(
    slot,
    pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION
  );
  console.log("session", session);

  // Getting info about Session
  var info = pkcs11.C_GetSessionInfo(session);
  console.log("info", info);

  // Login to the token
  pkcs11.C_Login(session, 1, "123456");
  const objectAttributes = [
    {
      type: pkcs11js.CKA_LABEL,
      value: pkcs11js.CKA_KEY_GEN_MECHANISM,
    },
  ];
  console.log("objectAttributes", objectAttributes);

  // Create the object
  const dataObject = pkcs11.C_CreateObject(
    session,
    objectAttributes
  );

  if (dataObject === pkcs11js.CK_INVALID_HANDLE) {
    throw new Error("Error creating object");
  } else {
    console.log("Object created successfully");
    console.log("nObject", dataObject);
  }

  // Logout and close the session
  pkcs11.C_Logout(session);
  pkcs11.C_CloseSession(session);
} catch (e) {
  console.log("Error:", e.message);
  console.error(e);
} finally {
  // Finalize PKCS#11 module
  pkcs11.C_Finalize();
}
