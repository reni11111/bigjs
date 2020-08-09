const Big = require('big.js')

let order = {
  id: "orderTestId",
  lineItems: [
    {
      itemName: "apple",
      quantity: 2.552,
      itemId: "1234",
      variationName: "red apple",
      variationId: "2345",
      basePriceMoney: {
        amount: 255,
        currency: "All"
      },
      modifiers: [{
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
        percentage: 22
      },
      appliedDiscounts: [
        {
          id: "discountId1",
          name: "black friday 5%",
          discountType: "FIXED_PERCENTAGE",
          percentage: 10
        },
        {
          id: "discountId2",
          name: "black friday 50%",
          discountType: "FIXED_PERCENTAGE",
          percentage: 50
        },
        {
          id: "discountId3",
          name: "black friday 20%",
          discountType: "FIXED_PERCENTAGE",
          percentage: 50
        },
        {
          id: "discountId24",
          name: "dita e veres 5%",
          discountType: "FIXED_AMOUNT",
          appliedMoney: {
            amount: 5,
            currency: "All"
          }
        },
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
      // kjo ndoshta ju duhet ? dmth cmimi mbasi kam aplikuar discount/taksa tek ky produkt
      // totalMoney: {
      //   amount: 124,
      //   currency: "All"
      // }
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
  tax: {
    id: "tax1",
    name: "taksa e tvsh",
    percentage: 5
  },
  totalMoney: {
    amount: 1000,
    currency: "All"
  },
  totalTaxMoney: {
    amount: 10,
    currency: "All"
  },
  totalDiscountMoney: {
    amount: 100,
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

// kujdes rrumbullakosjet


// div will only keep 2 decimal values
Big.DP = 2
// + before function is same as Number()

let orderTotalMoney = 0
let orderTotalTax = 0
let orderTotalDiscount = 0

order.lineItems.map(orderLineItem => {
  const modifiersPrice = +orderLineItem.modifiers.reduce((sum, { appliedMoney }) => Big(sum).plus(appliedMoney.amount), 0)

  const basePrice = +Big(orderLineItem.basePriceMoney.amount).plus(modifiersPrice)

  const priceWithQuantity = +Big(basePrice).times(orderLineItem.quantity).round(2)

  const itemPercentageDiscounts = orderLineItem.appliedDiscounts.filter(discount => discount.discountType === "FIXED_PERCENTAGE")

  // percentage might be 0.1% or less so DP=2 would round that to 0
  Big.DP = 10

  // when multiple appliedDiscounts apply the next discount the the product who has been discounted
  // by the previous discount
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

  Big.DP = 2

  // line item discount amount
  const itemAmountDiscounts = orderLineItem.appliedDiscounts.filter(discount => discount.discountType === "FIXED_AMOUNT")

  const itemWithItemAmountDiscount = +Big(itemAmountDiscounts.reduce((itemPrice, { appliedMoney }) => {
    return +Big(itemPrice).minus(appliedMoney.amount)
  }, priceWithOrderPercentageDiscounts))


  // order amount discount here

  console.log("modifiers", modifiersPrice)
  console.log("basePrice", basePrice)
  console.log("priceWithQuantity", priceWithQuantity)
  console.log("percentage", priceWithItemDiscounts)

  console.log("amount", itemWithItemAmountDiscount)
}, 0)



// big js round tests and DP
// to fixed has rounding 



// let x = new Big(0.118)

// let y = x.plus(0.1921).plus(1).round(2)


// console.log(Number(x),Number(y))


// let z = x.plus(22222).div(100000)
// z = Big(2.10111).times(100).round(2)

// console.log(Number(z))


// let orde2r = {
//   id: "orderTestId",
//   lineItems: [
//     {
//       itemName: "apple"
//       quantity: 2.552
//       itemId: "1234"
//       variationName: "red apple"
//       variationId: "2345"
//       basePriceMoney: {
//         amount: 255
//         currency: "All"
//       }
//       modifiers: [{
//         id: "majonezeId"
//         name: "majoneze"
//         modifierListId: "salacatId"
//         modifierListName: "salcat"
//         appliedMoney: {
//           amount: 5
//           currency: "All"
//         }
//       },
//       {
//         id: "ketchupId"
//         name: "ketchup"
//         modifierListId: "salacatId"
//         modifierListName: "salcat"
//         appliedMoney: {
//           amount: 7
//           currency: "All"
//         }
//       }]
//       appliedTax: {
//         id: "taxId12"
//         name: "tax the rich"
//         percentage: 22
//       }
//       appliedDiscounts: [
//         {
//           id: "discountId1"
//           name: "black friday 5%"
//           discountType: "FIXED_PERCENTAGE"
//           percentage: 10
//         },
//         {
//           id: "discountId2"
//           name: "black friday 50%"
//           discountType: "FIXED_PERCENTAGE"
//           percentage: 50
//         },
//         {
//           id: "discountId3"
//           name: "black friday 20%"
//           discountType: "FIXED_PERCENTAGE"
//           percentage: 50
//         },
//         {
//           id: "discountId24"
//           name: "dita e veres 5%"
//           discountType: "FIXED_AMOUNT"
//           appliedMoney: {
//             amount: 5
//             currency: "All"
//           }
//         },
//         {
//           id: "discountId24"
//           name: "dita e veres 5%"
//           discountType: "FIXED_AMOUNT"
//           appliedMoney: {
//             amount: 10
//             currency: "All"
//           }
//         }
//       ]
//     }
//   ]
//   appliedDiscounts: [
//     {
//       id: "discountId2"
//       name: "black friday 5%"
//       discountType: "FIXED_PERCENTAGE"
//       percentage: 10
//     }
//   ]
//   tax: {
//     id: "tax1"
//     name: "taksa e tvsh"
//     percentage: 5
//   }
//   totalMoney: {
//     amount: 1000
//     currency: "All"
//   }
//   totalTaxMoney: {
//     amount: 10
//     currency: "All"
//   }
//   totalDiscountMoney: {
//     amount: 100
//     currency: "All"
//   }
// }