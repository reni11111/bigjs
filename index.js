const Big = require('big.js')

let order = {
  id: "orderTestId",
  "lineItems": [
    {
      "itemName": "Fletore vizatimi",
      "quantity": 2,
      "barcode": "12345679",
      "itemId": "1kU2Bx8kDVAQkfN5t2DgHeG0FQj",
      "variationName": "Regular",
      "variationId": "1kU2BwD6bQRH3jb6eimQpw8AIXG",
      "basePriceMoney": {
          "amount": 100,
          "currency": "Lekë"
      },
      "modifiers": [],
      "appliedTax": {
          "id": "Tax0%",
          "name": "0%",
          "percentage": 10
      },
      "appliedDiscounts": [
          // {
          //     "id": "1kU99q9mA7FYLKElokwQ6NM3ZDy",
          //     "name": "100 leke ulje",
          //     "discountType": "FIXED_AMOUNT",
          //     "percentage": null,
          //     "appliedMoney": {
          //         "amount": 100,
          //         "currency": "Lekë"
          //     }
          // }
      ],
      "totalTaxMoney": {
          "amount": 18.18,
          "currency": "Lekë"
      },
      "totalDiscountMoney": {
          "amount": 0,
          "currency": "Lekë"
      },
      "totalMoney": {
          "amount": 200,
          "currency": "Lekë"
      },
      "imageUrl": null,
      "labelColor": "#6CCDFE",
      "taxInclusionType": "INCLUSIVE",
      // "priceWithItemAmountDiscount": 900
    },
    {
      "itemName": "Molle",
      "quantity": 3,
      "itemId": "itemi 2",
      "variationName": "Molle e kuqe",
      "variationId": "1hBQW8hgPDEOvLQUYmGANSDdEnW",
      "basePriceMoney": {
        "amount": 20,
        "currency": "Leke"
      },
      "taxInclusionType": "ADDITIVE",
      "modifiers": [],
      "appliedTax": {
        "id": "1hBOAwi9bdZsWVTHBjgHGfNGyyC",
        "name": "TVSH",
        "percentage": 20
      },
      "appliedDiscounts": [],
      "totalTaxMoney": {
        "amount": 12,
        "currency": "Leke"
      },
      "totalDiscountMoney": {
        "amount": 0,
        "currency": "Leke"
      },
      "totalMoney": {
        "amount": 72,
        "currency": "Leke"
      }
    },
  ],
  "locationId": "J11111111A",
  "appliedDiscounts": [
    // {
    //   "id": "1hH8DsoxX9gzXdVnTzZGyYfjS7e",
    //   "name": "100 Leke ulje",
    //   "discountType": "FIXED_AMOUNT",
    //   "percentage": null,
    //   "appliedMoney": {
    //     "amount": 100,
    //     "currency": "Leke"
    //   }
    // },
    // {
    //   "id": "1gEUQ8qBRHC6ROYws9MRQ3zGXeC",
    //   "name": "Drinks Discount",
    //   "discountType": "FIXED_PERCENTAGE",
    //   "percentage": 50,
    //   "appliedMoney": {
    //     "amount": 2,
    //     "currency": "EURO"
    //   }
    // }
  ],
  "totalMoney": {
    "amount": 272,
    "currency": "Leke"
  },
  "totalTaxMoney": {
    "amount": 30.18,
    "currency": "Leke"
  },
  "totalDiscountMoney": {
    "amount": 0,
    "currency": "Leke"
  }

}

let orderTotalMoney = 0
let orderTotalTax = 0
let orderTotalDiscount = 0

// to avoid if else at EVERY reduce function we can add empty array if no data
order.appliedDiscounts = order.appliedDiscounts || []

let lineItemsWithItemAmountDiscount = order.lineItems.map(orderLineItem => {
// to avoid if else at EVERY reduce function we can add empty array if no data
  orderLineItem.modifiers = orderLineItem.modifiers || []
  orderLineItem.modifiers = orderLineItem.modifiers || []
  orderLineItem.appliedDiscounts = orderLineItem.appliedDiscounts || []

  const modifiersPrice = orderLineItem.modifiers.reduce((sum, { appliedMoney }) => +Big(sum).plus(appliedMoney.amount), 0)

  const basePrice = +Big(orderLineItem.basePriceMoney.amount).plus(modifiersPrice)

  const priceWithQuantity = +Big(basePrice).times(orderLineItem.quantity).round(0)

  // percentage might be 0.1% or less so DP=2 would round that to 0
  Big.DP = 10

  // when multiple appliedDiscounts apply the next discount the the product who has been discounted
  // by the previous discount
  const itemPercentageDiscounts = orderLineItem.appliedDiscounts.filter(discount => discount.discountType === 'FIXED_PERCENTAGE' || discount.discountType === 'VARIABLE_PERCENTAGE' )
  const priceWithItemDiscounts = +Big(itemPercentageDiscounts.reduce((itemPrice, { percentage }) => {
    const discountPercentage = +Big(percentage).div(100)
    const discountValue = Big(itemPrice).times(discountPercentage).round(0)
    return+Big(itemPrice).minus(discountValue)
  }, priceWithQuantity))


  // do order % discount here
  const orderPercentageDiscounts = order.appliedDiscounts.filter(discount => discount.discountType === 'FIXED_PERCENTAGE' || discount.discountType === 'VARIABLE_PERCENTAGE')
  const priceWithOrderPercentageDiscounts = +Big(orderPercentageDiscounts.reduce((itemPrice, { percentage }) => {
    const discountPercentage = +Big(percentage).div(100)
    const discountValue = Big(itemPrice).times(discountPercentage).round(0)
    return+Big(itemPrice).minus(discountValue)
  }, priceWithItemDiscounts))


  // line item discount amount
  const itemAmountDiscounts = orderLineItem.appliedDiscounts.filter(discount => discount.discountType === 'FIXED_AMOUNT' || discount.discountType === 'VARIABLE_AMOUNT')

  console.log(priceWithOrderPercentageDiscounts)
  const priceWithItemAmountDiscount = +Big(itemAmountDiscounts.reduce((itemPrice, { appliedMoney }) => {
    return +Big(itemPrice).minus(+Big(appliedMoney.amount).times(orderLineItem.quantity))
  }, priceWithOrderPercentageDiscounts))
  console.log(priceWithItemAmountDiscount)


  // UPDATE ORDER TOTAL Discount
  let itemDiscount = +Big(priceWithQuantity).minus(priceWithItemAmountDiscount)
  orderTotalDiscount = +Big(orderTotalDiscount).plus(itemDiscount)

  orderLineItem.priceWithItemAmountDiscount = priceWithItemAmountDiscount
  return orderLineItem
})

// used to calculate portions of each items  order amount discount
const orderCurrentSubtotal = +Big(lineItemsWithItemAmountDiscount.reduce((itemPrice, { priceWithItemAmountDiscount }) => {
  return+Big(itemPrice).plus(priceWithItemAmountDiscount)
}, 0))

// update order total discount
const orderAmountDiscounts = order.appliedDiscounts.filter(discount => discount.discountType === 'FIXED_AMOUNT' || discount.discountType === 'VARIABLE_AMOUNT')
const orderDiscountAmountsTotal = +Big(orderAmountDiscounts.reduce((price, { appliedMoney }) => {
  return+Big(price).plus(appliedMoney.amount)
}, 0))
orderTotalDiscount = +Big(orderTotalDiscount).plus(orderDiscountAmountsTotal).round(0)

let groupedTaxes ={}

lineItemsWithItemAmountDiscount.map(orderLineItem=>{

  const priceWithOrderAmountDiscounts = +Big(orderAmountDiscounts.reduce((itemPrice, { appliedMoney }) => {
    let itemCurrentSubtotalPortion = +new Big(orderLineItem.priceWithItemAmountDiscount).div(orderCurrentSubtotal)
    let itemOrderDiscount = + new Big(itemCurrentSubtotalPortion).times(appliedMoney.amount)

    return+Big(itemPrice).minus(itemOrderDiscount).round(0)
  }, orderLineItem.priceWithItemAmountDiscount))

  let priceWithTax = priceWithOrderAmountDiscounts
  if (orderLineItem.appliedTax) {
    let basePriceValue, taxValue

    if (orderLineItem.taxInclusionType === 'ADDITIVE') {
      const taxPercentage = +Big(orderLineItem.appliedTax.percentage).div(100)
      // UPDATE ORDER TOTAL TAX
      taxValue = +Big(priceWithOrderAmountDiscounts).times(taxPercentage)

      // values will be used at grouped taxes
      basePriceValue = priceWithOrderAmountDiscounts

      priceWithTax = +Big(priceWithTax).plus(taxValue).round(0)
    } else if(orderLineItem.taxInclusionType === 'INCLUSIVE'){
      console.log("ERDHII")
      // inclusive basePrice price/(1+vat/100)
      basePriceValue = +Big(priceWithOrderAmountDiscounts).div(+Big(1).plus(+Big(orderLineItem.appliedTax.percentage).div(100))).round(2)
      // inclusive vatValue price - basePrice
      taxValue = +Big(priceWithOrderAmountDiscounts).minus(basePriceValue).round(2)
    }

    orderTotalTax = +Big(orderTotalTax).plus(taxValue)

    if (!Big(taxValue).eq(orderLineItem.totalTaxMoney.amount)) {
      throw new Error(`item inclusive applied TAX ${orderLineItem.itemId} calculated wrong!, should be ${taxValue}`)
    }

        // grouped taxes
    if (!(orderLineItem.appliedTax.percentage in groupedTaxes)) {
      console.log("not included")
      groupedTaxes[orderLineItem.appliedTax.percentage] = {
        VATRate: orderLineItem.appliedTax.percentage,
        NumOfItems: orderLineItem.quantity,
        // updated at end
        PriceBefVat: basePriceValue,
        // money amount of tax
        VATAmt: taxValue
      }
    } else {
      groupedTaxes[orderLineItem.appliedTax.percentage].NumOfItems += orderLineItem.quantity
      groupedTaxes[orderLineItem.appliedTax.percentage].VATAmt += taxValue
      groupedTaxes[orderLineItem.appliedTax.percentage].PriceBefVat += basePriceValue
    }
    console.log(groupedTaxes)
  }

  orderTotalMoney = +Big(orderTotalMoney).plus(priceWithTax)

  console.log('final pricing with tax', priceWithTax)
  if(Big(priceWithTax).lt(0)){
    throw new Error(`item ${JSON.stringify(orderLineItem)} price should not be under 0!`)
  }

  if(!Big(priceWithTax).eq(orderLineItem.totalMoney.amount)) {
    throw new Error(`item ${JSON.stringify(orderLineItem)} calculated wrong!, should be ${priceWithTax}`)
  }

})

console.log('order total money', orderTotalMoney)
console.log('order total discount', orderTotalDiscount)
console.log('order total tax', orderTotalTax)

if(!Big(order.totalMoney.amount).eq(orderTotalMoney)) {
  throw new Error(`Order totalMoney calculated wrong, it should be ${orderTotalMoney}!`)
}

if(!Big(order.totalTaxMoney.amount).eq(orderTotalTax)) {
  throw new Error(`Order totalTaxMoney calculated wrong, it should be ${orderTotalTax}!`)
}

if(!Big(order.totalDiscountMoney.amount).eq(orderTotalDiscount)) {
  throw new Error(`Order totalDiscountMoney calculated wrong, it should be ${orderTotalDiscount}!`)
}

// convert to array
groupedTaxes = Object.keys(groupedTaxes).map(key=> groupedTaxes[key])

console.log(groupedTaxes)