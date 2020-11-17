const Big = require('big.js')

let order = {
  id: "orderTestId",
  "lineItems": [
    {
      "itemName": "Molle",
      "quantity": 1,
      "itemId": "itemi1",
      "variationName": "Molle e kuqe",
      "variationId": "1hBQW8hgPDEOvLQUYmGANSDdEnW",
      "basePriceMoney": {
        "amount": 120,
        "currency": "Leke"
      },
      "modifiers": [],
      "appliedTax": {
        "id": "1hBOAwi9bdZsWVTHBjgHGfNGyyC",
        "name": "TVSH",
        "percentage": 20,
        // "inclusionType": "ADDITIVE"
      },
      taxInclusionType: "ADDITIVE",
      "appliedDiscounts": [],
      "totalTaxMoney": {
        "amount": 24,
        "currency": "Leke"
      },
      "totalDiscountMoney": {
        "amount": 60,
        "currency": "Leke"
      },
      "totalMoney": {
        "amount": 144,
        "currency": "Leke"
      }
    },
    {
      "itemName": "Molle",
      "quantity": 1,
      "itemId": "itemi 2",
      "variationName": "Molle e kuqe",
      "variationId": "1hBQW8hgPDEOvLQUYmGANSDdEnW",
      "basePriceMoney": {
        "amount": 120,
        "currency": "Leke"
      },
      "modifiers": [],
      "appliedTax": {
        "id": "1hBOAwi9bdZsWVTHBjgHGfNGyyC",
        "name": "TVSH",
        "percentage": 20
      },
      "appliedDiscounts": [],
      "totalTaxMoney": {
        "amount": 24,
        "currency": "Leke"
      },
      "totalDiscountMoney": {
        "amount": 60,
        "currency": "Leke"
      },
      "totalMoney": {
        "amount": 120,
        "currency": "Leke"
      }
    },
    {
      "itemName": "Molle",
      "quantity": 1,
      "itemId": "itemi 3",
      "variationName": "Molle e kuqe",
      "variationId": "1hBQW8hgPDEOvLQUYmGANSDdEnW",
      "basePriceMoney": {
        "amount": 120,
        "currency": "Leke"
      },
      "modifiers": [],
      "appliedTax": {
        "id": "1hBOAwi9bdZsWVTHBjgHGfNGyyC",
        "name": "TVSH",
        "percentage": 6
      },
      "appliedDiscounts": [],
      "totalTaxMoney": {
        "amount": 7,
        "currency": "Leke"
      },
      "totalDiscountMoney": {
        "amount": 60,
        "currency": "Leke"
      },
      "totalMoney": {
        "amount": 120,
        "currency": "Leke"
      }
    }
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
    "amount": 384,
    "currency": "Leke"
  },
  "totalTaxMoney": {
    "amount": 55,
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
  const priceWithItemAmountDiscount = +Big(itemAmountDiscounts.reduce((itemPrice, { appliedMoney }) => {
    return+Big(itemPrice).minus(appliedMoney.amount)
  }, priceWithOrderPercentageDiscounts))

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
  if(orderLineItem.appliedTax) {
    const taxPercentage = +Big(orderLineItem.appliedTax.percentage).div(100)
    // UPDATE ORDER TOTAL TAX
    let itemTotalTax = +Big(priceWithOrderAmountDiscounts).times(taxPercentage).round(0)

    // grouped taxes
    if(!(orderLineItem.appliedTax.percentage in groupedTaxes)){
      console.log("not included")
      groupedTaxes[orderLineItem.appliedTax.percentage] ={
        VATRate: orderLineItem.appliedTax.percentage,
        NumOfItems: orderLineItem.quantity,
        // updated at end
        PriceBefVat: priceWithTax-itemTotalTax,
        // money amount of tax
        VATAmt : itemTotalTax
      }
    } else {
      groupedTaxes[orderLineItem.appliedTax.percentage].NumOfItems += orderLineItem.quantity
      groupedTaxes[orderLineItem.appliedTax.percentage].VATAmt += itemTotalTax
      groupedTaxes[orderLineItem.appliedTax.percentage].PriceBefVat += priceWithTax-itemTotalTax
    }
    console.log(groupedTaxes)

    if(!Big(itemTotalTax).eq(orderLineItem.totalTaxMoney.amount)) {
      throw new Error(`item applied TAX ${orderLineItem.itemId} calculated wrong!, should be ${itemTotalTax}`)
    }
    orderTotalTax = +Big(orderTotalTax).plus(itemTotalTax)

    if(orderLineItem.taxInclusionType === 'ADDITIVE') {
      priceWithTax = +Big(priceWithTax).plus(itemTotalTax)
    }
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