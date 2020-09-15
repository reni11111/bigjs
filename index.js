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
        amount: 30,
        currency: "All"
      },
      modifiers: [
        // {
        //   id: "majonezeId",
        //   name: "majoneze",
        //   modifierListId: "salacatId",
        //   modifierListName: "salcat",
        //   appliedMoney: {
        //     amount: 5,
        //     currency: "All"
        //   }
        // },
        // {
        //   id: "ketchupId",
        //   name: "ketchup",
        //   modifierListId: "salacatId",
        //   modifierListName: "salcat",
        //   appliedMoney: {
        //     amount: 7,
        //     currency: "All"
        //   }
        // }
      ],
      appliedTax: {
        id: "taxId12",
        name: "tax the rich",
        percentage: 10,
        //can be ADDITIVE too
        // inclusionType: "ADDITIVE"
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
        amount: 47,
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
        percentage: 10,
        //can be ADDITIVE too
        // inclusionType: "ADDITIVE"
      },
      totalMoney: {
        amount: 93,
        currency: "All"
      }
    }
  ],
  //order discount
  appliedDiscounts: [
    {
      id: "discountId2",
      name: "black friday 10",
      discountType: "FIXED_AMOUNT",
      appliedMoney: {
        amount: 10,
        currency: "All"
      }
    },
  ],
  totalMoney: {
    amount: 140,
    currency: "All"
  },
  totalTaxMoney: {
    amount: 14,
    currency: "All"
  },
  totalDiscountMoney: {
    amount: 20,
    currency: "All"
  },
}


//1. add itemVariation price with modifiers price
//2. price x quantity
//3. apply item percentage discount
//4. apply order percentage discount
//4. apply item fixed amount discount
//5. find order subtotal of items with fixed amount discount
//6. apply portion of order fixed amount discount 
// (if order discount is amount=10 and we have 2 items with price 80 and 20 each of them gets only the portion, so the first item gets80% of the discount
// 80-8 =72  and the second item gets 20% of the discount 20-2 =18)
//7. apply item tax
//8. sum all products


let orderTotalMoney = 0
let orderTotalTax = 0
let orderTotalDiscount = 0

//to avoid if else at EVERY reduce function we can add empty array if no data
order.appliedDiscounts = order.appliedDiscounts || []

let lineItemsWithItemAmountDiscount = order.lineItems.map(orderLineItem => {
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
  const priceWithItemAmountDiscount = +Big(itemAmountDiscounts.reduce((itemPrice, { appliedMoney }) => {
    return +Big(itemPrice).minus(appliedMoney.amount)
  }, priceWithOrderPercentageDiscounts))

  // UPDATE ORDER TOTAL Discount
  let itemDiscount = +Big(priceWithQuantity).minus(priceWithItemAmountDiscount)
  orderTotalDiscount = +Big(orderTotalDiscount).plus(itemDiscount)

  orderLineItem.priceWithItemAmountDiscount = priceWithItemAmountDiscount
  return orderLineItem
})

// used to calculate portions of each items  order amount discount
const orderCurrentSubtotal = +Big(lineItemsWithItemAmountDiscount.reduce((itemPrice, { priceWithItemAmountDiscount }) => {
  return +Big(itemPrice).plus(priceWithItemAmountDiscount)
}, 0))

// update order total discount
const orderAmountDiscounts = order.appliedDiscounts.filter(discount => discount.discountType === "FIXED_AMOUNT")
const orderDiscountAmountsTotal = +Big(orderAmountDiscounts.reduce((price, { appliedMoney }) => {
  return +Big(price).plus(appliedMoney.amount)
}, 0))
orderTotalDiscount = +Big(orderTotalDiscount).plus(orderDiscountAmountsTotal).round(0)


lineItemsWithItemAmountDiscount.map(orderLineItem=>{
    // order amount discount here
    // console.log(orderAmountDiscounts)

    const priceWithOrderAmountDiscounts = +Big(orderAmountDiscounts.reduce((itemPrice, { appliedMoney }) => {
      let itemCurrentSubtotalPortion = +new Big(orderLineItem.priceWithItemAmountDiscount).div(orderCurrentSubtotal)
      let itemOrderDiscount = + new Big(itemCurrentSubtotalPortion).times(appliedMoney.amount)

      return +Big(itemPrice).minus(itemOrderDiscount).round(0)
    }, orderLineItem.priceWithItemAmountDiscount))

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
  
    orderTotalMoney = +Big(orderTotalMoney).plus(priceWithTax)
  
    console.log("final pricing with tax", priceWithTax)
    if(Big(priceWithTax).lt(0)){
      throw new Error(`item ${JSON.stringify(orderLineItem)} price should not be under 0!`)
    }
  
    if (!Big(priceWithTax).eq(orderLineItem.totalMoney.amount)) {
      throw new Error(`item ${JSON.stringify(orderLineItem)} calculated wrong!`)
    }
})

console.log("order total money", orderTotalMoney)
console.log("order total discount", orderTotalDiscount)
console.log("order total tax", orderTotalTax)

if (!Big(order.totalMoney.amount).eq(orderTotalMoney)) {
  throw new Error(`Order totalMoney calculated wrong, it should be ${orderTotalMoney}!`)
}

if (!Big(order.totalTaxMoney.amount).eq(orderTotalTax)) {
  throw new Error(`Order totalTaxMoney calculated wrong, it should be ${orderTotalTax}!`)
}

if (!Big(order.totalDiscountMoney.amount).eq(orderTotalDiscount)) {
  throw new Error(`Order totalDiscountMoney calculated wrong, it should be ${orderTotalDiscount}!`)
}