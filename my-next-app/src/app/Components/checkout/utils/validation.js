import { notify } from "./toast"

export const validateAddress = (address) => {
  const addressFields = [
    {
      key: "phone",
      label: "Phone number",
      regex: /^\+[0-9]{10,15}$/,
      errorMessages: {
        empty: "Phone number is required",
        invalid: "Phone number must start with + and contain 10-15 digits",
      },
    },
    { key: "region", label: "Region", errorMessages: { empty: "Please select your region" } },
    {
      key: "address-direction",
      label: "Address directions",
      errorMessages: { empty: "Please provide detailed address directions for delivery" },
    },
    { key: "building", label: "Building", errorMessages: { empty: "Building name/number is required for delivery" } },
    {
      key: "floor",
      label: "Floor number",
      regex: /^[0-9]{1,3}$/,
      errorMessages: { empty: "Floor number is required", invalid: "Floor number must be a valid number (1-999)" },
    },
  ]

  let isValid = true
  let allEmpty = true

  for (const field of addressFields) {
    if (!address[field.key]) {
      allEmpty = allEmpty && true
      isValid = false
    } else {
      allEmpty = false
    }

    if (field.regex && address[field.key] && !field.regex.test(address[field.key])) {
      notify("error", field.errorMessages.invalid)
      return false // Return early on first validation error for better UX
    }
  }

  if (allEmpty) {
    notify("error", "Please add your address details.")
    return false
  }

  return isValid
}

export const validatePayment = (payment) => {
  const paymentFields = [
    { key: "cardName", label: "Card name", errorMessages: { empty: "Cardholder name is required" } },
    {
      key: "cardNumber",
      label: "Card number",
      regex: /^[0-9]{16}$/,
      errorMessages: {
        empty: "Card number is required",
        invalid: "Card number must be 16 digits with no spaces or dashes",
      },
    },
    {
      key: "expDate",
      label: "Expiration date",
      regex: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      errorMessages: {
        empty: "Card expiration date is required",
        invalid: "Expiration date must be in MM/YY format (e.g., 05/25)",
      },
    },
    {
      key: "cvv",
      label: "CVV",
      regex: /^[0-9]{3,4}$/,
      errorMessages: {
        empty: "Security code (CVV) is required",
        invalid: "CVV must be 3-4 digits found on the back of your card",
      },
    },
  ]

  let isValid = true
  let allEmpty = true

  for (const field of paymentFields) {
    if (!payment[field.key]) {
      allEmpty = allEmpty && true
      isValid = false
    } else {
      allEmpty = false
    }

    if (field.regex && payment[field.key] && !field.regex.test(payment[field.key])) {
      notify("error", field.errorMessages.invalid)
      return false // Return early on first validation error for better UX
    }
  }

  if (allEmpty) {
    notify("error", "Please add your payment details.")
    return false
  }

  return isValid
}

