const Big = require('big.js')

let order = {
  id: "orderTestId",
  lineItems: [
    {
      itemName: "apple",
      quantity: 2,
      itemId: "1234",
      variationName: "red apple",
      variationId: "2345",
      basePriceMoney: {
        amount: 255,
        currency: "All"
      },
      modifiers: [
        {
          id: "majonezeId",
          name: "majoneze",
          modifierListId: "salacatId",
          modifierListName: "salcat",
          appliedMoney: {
            amount: 5,
            currency: "All"
          }
        },
        {
          id: "ketchupId",
          name: "ketchup",
          modifierListId: "salacatId",
          modifierListName: "salcat",
          appliedMoney: {
            amount: 7,
            currency: "All"
          }
        }],
      appliedTax: {
        id: "taxId12",
        name: "tax the rich",
        percentage: 20,
        //can be ADDITIVE too
        inclusionType: "ADDITIVE"
      },
      appliedDiscounts: [
        {
          id: "discountId24",
          name: "dita e veres 5%",
          discountType: "FIXED_AMOUNT",
          appliedMoney: {
            amount: 10,
            currency: "All"
          }
        }
      ],
      totalMoney: {
        amount: 565,
        currency: "All"
      }
    },
    {
      itemName: "apple",
      quantity: 1,
      itemId: "1234",
      variationName: "red apple",
      variationId: "2345",
      basePriceMoney: {
        amount: 100,
        currency: "All"
      },
      appliedTax: {
        id: "taxId12",
        name: "tax the rich",
        percentage: 1,
        //can be ADDITIVE too
        // inclusionType: "ADDITIVE"
      },
      totalMoney: {
        amount: 90,
        currency: "All"
      }
    }
  ],
  //order discount
  appliedDiscounts: [
    {
      id: "discountId2",
      name: "black friday 5%",
      discountType: "FIXED_PERCENTAGE",
      percentage: 10
    },
  ],
  totalMoney: {
    amount: 655,
    currency: "All"
  },
  totalTaxMoney: {
    amount: 95,
    currency: "All"
  },
  totalDiscountMoney: {
    amount: 73,
    currency: "All"
  },
}


//1. add itemVariation price with modifiers price
//2. price x quantity
//3. apply item percentage discount
//4. apply order percentage discount
//4. apply item fixed amount discount
//5. apply order fixed amount discount
//6. apply item tax
//7. sum all products


let orderTotalMoney = 0
let orderTotalTax = 0
let orderTotalDiscount = 0

//to avoid if else at EVERY reduce function we can add empty array if no data
order.appliedDiscounts = order.appliedDiscounts || []

order.lineItems.map(orderLineItem => {
  console.log("NEW ITEM")
  //to avoid if else at EVERY reduce function we can add empty array if no data
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
  const itemPercentageDiscounts = orderLineItem.appliedDiscounts.filter(discount => discount.discountType === "FIXED_PERCENTAGE")
  const priceWithItemDiscounts = +Big(itemPercentageDiscounts.reduce((itemPrice, { percentage }) => {
    const discountPercentage = +Big(percentage).div(100)
    const discountValue = Big(itemPrice).times(discountPercentage).round(0)
    return +Big(itemPrice).minus(discountValue)
  }, priceWithQuantity))


  // do order % discount here
  const orderPercentageDiscounts = order.appliedDiscounts.filter(discount => discount.discountType === "FIXED_PERCENTAGE")
  const priceWithOrderPercentageDiscounts = +Big(orderPercentageDiscounts.reduce((itemPrice, { percentage }) => {
    const discountPercentage = +Big(percentage).div(100)
    const discountValue = Big(itemPrice).times(discountPercentage).round(0)
    return +Big(itemPrice).minus(discountValue)
  }, priceWithItemDiscounts))


  // line item discount amount
  const itemAmountDiscounts = orderLineItem.appliedDiscounts.filter(discount => discount.discountType === "FIXED_AMOUNT")
  const itemWithItemAmountDiscount = +Big(itemAmountDiscounts.reduce((itemPrice, { appliedMoney }) => {
    return +Big(itemPrice).minus(appliedMoney.amount)
  }, priceWithOrderPercentageDiscounts))


  // order amount discount here
  const orderAmountDiscounts = order.appliedDiscounts.filter(discount => discount.discountType === "FIXED_AMOUNT")
  const priceWithOrderAmountDiscounts = +Big(orderAmountDiscounts.reduce((itemPrice, { appliedMoney }) => {
    return +Big(itemPrice).minus(appliedMoney.amount)
  }, itemWithItemAmountDiscount))


  // UPDATE ORDER TOTAL Discount
  let itemTotalDiscount = +Big(priceWithQuantity).minus(priceWithOrderAmountDiscounts)
  orderTotalDiscount = +Big(orderTotalDiscount).plus(itemTotalDiscount)

  let priceWithTax = priceWithOrderAmountDiscounts
  if (orderLineItem.appliedTax) {
    const taxPercentage = +Big(orderLineItem.appliedTax.percentage).div(100)
    // UPDATE ORDER TOTAL TAX
    let itemTotalTax = +Big(priceWithOrderAmountDiscounts).times(taxPercentage).round(0)
    orderTotalTax = +Big(orderTotalTax).plus(itemTotalTax)

    if (orderLineItem.appliedTax.inclusionType === "ADDITIVE") {
      priceWithTax = +Big(priceWithTax).plus(itemTotalTax)
    }
  }


  // let priceWithTax = priceWithOrderAmountDiscounts
  // if (orderLineItem.appliedTax) {
  //   const taxPercentage = +Big(orderLineItem.appliedTax.percentage).div(100)
  //   // UPDATE ORDER TOTAL TAX
  //   orderTotalTax = +Big(priceWithOrderAmountDiscounts).times(taxPercentage).round(0)

  //   if (orderLineItem.appliedTax.inclusionType === "ADDITIVE") {
  //     priceWithTax = +Big(priceWithTax).plus(orderTotalTax)
  //   }
  // }

  orderTotalMoney = +Big(orderTotalMoney).plus(priceWithTax)

  console.log("modifiers", modifiersPrice)
  console.log("basePrice", basePrice)
  console.log("priceWithQuantity", priceWithQuantity)
  console.log("percentage item discount", priceWithItemDiscounts)
  console.log("amount item amount", itemWithItemAmountDiscount)
  console.log("final pricing with tax", priceWithTax)

  if (!Big(priceWithTax).eq(orderLineItem.totalMoney.amount)) {
    throw new Error(`item ${JSON.stringify(orderLineItem)} calculated wrong!`)
  }
}, 0)

console.log("order total money", orderTotalMoney)
console.log("order total discount", orderTotalDiscount)
console.log("order total tax", orderTotalTax)

if (!Big(order.totalMoney.amount).eq(orderTotalMoney)) {
  throw new Error(`order totalMoney calculated wrong!`)
}

if (!Big(order.totalTaxMoney.amount).eq(orderTotalTax)) {
  throw new Error(`order totalTaxMoney calculated wrong!`)
}

if (!Big(order.totalDiscountMoney.amount).eq(orderTotalDiscount)) {
  throw new Error(`order totalDiscountMoney calculated wrong!`)
}


// big js round tests and DP
// to fixed has rounding 



// let x = new Big(0.118)

// let y = x.plus(0.1921).plus(1).round(2)


// console.log(Number(x),Number(y))


// let z = x.plus(22222).div(100000)
// z = Big(2.10111).times(100).round(2)

// console.log(Number(z))