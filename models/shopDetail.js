import mongoose from "mongoose";

const shopDetails = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
    },
    stateId: String,
    city: {
      type: String,
      required: true,
    },
    cityId: String,
    shopType: {
      type: String,
      required: true,
    },
    shopId: String,
    openingHours: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      validate: {
        validator: async function(value) {
          const mobileNumberRegex = /^\+91[0-9]{10}$/;
          if (!mobileNumberRegex.test(value)) {
            return false; // Return false if the mobile number format is invalid
          }
          const existingShop = await this.model("ShopDetails").findOne({ mobileNo: value });
          return !existingShop;
        },
        message: props => `${props.value} is not a valid or is already in use as a mobile number!`,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ShopDetails", shopDetails);
