const Big = require('big.js')

let order = {
  "lineItems": [
    {
      "itemName": "Laps",
      "quantity": 1,
      "barcode": "12345678",
      "itemId": "1kU0VcdLD1V0EnFFtEpcKsa0Gez",
      "variationName": "Regular",
      "variationId": "1kU0Vc8NXbeGkRtxxlWD9Rt9MIN",
      "basePriceMoney": {
        "amount": 20,
        "currency": "Lekë"
      },
      "modifiers": [],
      "appliedTax": {
        "id": "Tax20%",
        "name": "20%",
        "percentage": 20
      },
      "appliedDiscounts": [],
      "totalTaxMoney": {
        "amount": 4,
        "currency": "Lekë"
      },
      "totalDiscountMoney": {
        "amount": 0,
        "currency": "Lekë"
      },
      "totalMoney": {
        "amount": 24,
        "currency": "Lekë"
      },
      "imageUrl": null,
      "labelColor": "#EF5350",
      "taxInclusionType": "ADDITIVE"
    },
    {
      "itemName": "Bllok",
      "quantity": 1,
      "barcode": null,
      "itemId": "1kYuMp3h3lPKqv9cXB76nYbTe2n",
      "variationName": "Txtixigxkggkchchi",
      "variationId": "1kZF6ixFHhdn5n7RheW45yrt1jG",
      "basePriceMoney": {
        "amount": 88,
        "currency": "Lekë"
      },
      "modifiers": [],
      "appliedTax": {
        "id": "Tax0%",
        "name": "0%",
        "percentage": 0
      },
      "appliedDiscounts": [],
      "totalTaxMoney": {
        "amount": 0,
        "currency": "Lekë"
      },
      "totalDiscountMoney": {
        "amount": 0,
        "currency": "Lekë"
      },
      "totalMoney": {
        "amount": 88,
        "currency": "Lekë"
      },
      "imageUrl": "https://item-bucket-saas.s3.eu-central-1.amazonaws.com/1g2VqQJbzs3rKtQOklfNUhbzD8I_1kYuMp3h3lPKqv9cXB76nYbTe2n_1kZGOCHl6PpJy93u95rXRFSnJAQ.jpg",
      "labelColor": null,
      "taxInclusionType": "INCLUSIVE"
    },
    {
      "itemName": "Hamburger",
      "quantity": 1,
      "barcode": "987654321",
      "itemId": "1kUAAkxz5tkPoAPks3A92uY0Qcf",
      "variationName": "Sandwich 11",
      "variationId": "1kZBslrv9GrDqLbNGiH64QExdLi",
      "basePriceMoney": {
        "amount": 600,
        "currency": "Lekë"
      },
      "modifiers": [
        {
          "id": "1kU8z2VxYbrJjDHJN75zUmmei07",
          "name": "Speca",
          "modifierListId": "1kU8yxUoYmgdAkbIYHg2Q0eIIXb",
          "modifierListName": "Perime ekstra",
          "appliedMoney": {
            "amount": 30,
            "currency": "Lekë"
          }
        },
        {
          "id": "1kU8z49LSVB7xH46fZBOHLaMYfr",
          "name": "Sallate",
          "modifierListId": "1kU8yxUoYmgdAkbIYHg2Q0eIIXb",
          "modifierListName": "Perime ekstra",
          "appliedMoney": {
            "amount": 10,
            "currency": "Lekë"
          }
        },
        {
          "id": "1kU8z6Pigs3BF2OGZ1FlpoueeFH",
          "name": "Domate",
          "modifierListId": "1kU8yxUoYmgdAkbIYHg2Q0eIIXb",
          "modifierListName": "Perime ekstra",
          "appliedMoney": {
            "amount": 20,
            "currency": "Lekë"
          }
        }
      ],
      "appliedTax": {
        "id": "Tax20%",
        "name": "20%",
        "percentage": 20
      },
      "appliedDiscounts": [
        {
          "id": "1kU29V4aEYpfkOjbWZdJFEGU3FM",
          "name": "Black friday",
          "discountType": "FIXED_PERCENTAGE",
          "percentage": 5,
          "appliedMoney": null
        }
      ],
      "totalTaxMoney": {
        "amount": 125.4,
        "currency": "Lekë"
      },
      "totalDiscountMoney": {
        "amount": 33,
        "currency": "Lekë"
      },
      "totalMoney": {
        "amount": 752.4,
        "currency": "Lekë"
      },
      "imageUrl": null,
      "labelColor": null,
      "taxInclusionType": "ADDITIVE"
    },
    {
      "itemName": "Stilolaps",
      "quantity": 1,
      "barcode": null,
      "itemId": "1kcLe2SGb9w4k9UpkR3s88s4qw0",
      "variationName": "Regular",
      "variationId": "1kcLe47e2jqyuOXu3mIR8uvmF2Z",
      "basePriceMoney": {
        "amount": 200,
        "currency": "Lekë"
      },
      "modifiers": [],
      "appliedTax": {
        "id": "Tax10%",
        "name": "10%",
        "percentage": 10
      },
      "appliedDiscounts": [],
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
      "taxInclusionType": "INCLUSIVE"
    },
    {
      "itemName": "Fletore vizatimi",
      "quantity": 1,
      "barcode": "12345679",
      "itemId": "1kU2Bx8kDVAQkfN5t2DgHeG0FQj",
      "variationName": "Regular",
      "variationId": "1kU2BwD6bQRH3jb6eimQpw8AIXG",
      "basePriceMoney": {
        "amount": 350,
        "currency": "Lekë"
      },
      "modifiers": [],
      "appliedTax": {
        "id": "Tax20%",
        "name": "20%",
        "percentage": 20
      },
      "appliedDiscounts": [
        {
          "id": "1kU99q9mA7FYLKElokwQ6NM3ZDy",
          "name": "350 leke ulje",
          "discountType": "FIXED_AMOUNT",
          "percentage": null,
          "appliedMoney": {
            "amount": 350,
            "currency": "Lekë"
          }
        }
      ],
      "totalTaxMoney": {
        "amount": 0,
        "currency": "Lekë"
      },
      "totalDiscountMoney": {
        "amount": 350,
        "currency": "Lekë"
      },
      "totalMoney": {
        "amount": 0,
        "currency": "Lekë"
      },
      "imageUrl": null,
      "labelColor": "#6CCDFE",
      "taxInclusionType": "ADDITIVE"
    }
  ],
  "locationId": "J11111111A",
  "appliedDiscounts": [],
  "totalMoney": {
    "amount": 1064.4,
    "currency": "Lekë"
  },
  "totalTaxMoney": {
    "amount": 147.58,
    "currency": "Lekë"
  },
  "totalDiscountMoney": {
    "amount": 383,
    "currency": "Lekë"
  },
  "orderGroupedTaxes": [
    {
      "VATRate": 0,
      "NumOfItems": 1,
      "PriceBefVat": {
        "amount": 88,
        "currency": "Lekë"
      },
      "VATAmt": {
        "amount": 0,
        "currency": "Lekë"
      }
    },
    {
      "VATRate": 10,
      "NumOfItems": 1,
      "PriceBefVat": {
        "amount": 180,
        "currency": "Lekë"
      },
      "VATAmt": {
        "amount": 20,
        "currency": "Lekë"
      }
    },
    {
      "VATRate": 20,
      "NumOfItems": 3,
      "PriceBefVat": {
        "amount": 518,
        "currency": "Lekë"
      },
      "VATAmt": {
        "amount": 129,
        "currency": "Lekë"
      }
    }
  ]
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

  // percentage might be 0.1% or less so DP=2 would round that to 0
  Big.DP = 10

  const modifiersPrice = orderLineItem.modifiers.reduce((sum, { appliedMoney }) => +Big(sum).plus(appliedMoney.amount), 0)

  const basePrice = +Big(orderLineItem.basePriceMoney.amount).plus(modifiersPrice)

  const priceWithQuantity = +Big(basePrice).times(orderLineItem.quantity)

  // when multiple appliedDiscounts apply the next discount the the product who has been discounted
  // by the previous discount
  const itemPercentageDiscounts = orderLineItem.appliedDiscounts.filter(discount => discount.discountType === 'FIXED_PERCENTAGE' || discount.discountType === 'VARIABLE_PERCENTAGE' )
  const priceWithItemDiscounts = +Big(itemPercentageDiscounts.reduce((itemPrice, { percentage }) => {
    const discountPercentage = +Big(percentage).div(100)
    const discountValue = Big(itemPrice).times(discountPercentage)
    return+Big(itemPrice).minus(discountValue)
  }, priceWithQuantity))


  // do order % discount here
  const orderPercentageDiscounts = order.appliedDiscounts.filter(discount => discount.discountType === 'FIXED_PERCENTAGE' || discount.discountType === 'VARIABLE_PERCENTAGE')
  const priceWithOrderPercentageDiscounts = +Big(orderPercentageDiscounts.reduce((itemPrice, { percentage }) => {
    const discountPercentage = +Big(percentage).div(100)
    const discountValue = Big(itemPrice).times(discountPercentage)
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
orderTotalDiscount = +Big(orderTotalDiscount).plus(orderDiscountAmountsTotal)

let groupedTaxes ={}

lineItemsWithItemAmountDiscount.map(orderLineItem=>{

  const priceWithOrderAmountDiscounts = +Big(orderAmountDiscounts.reduce((itemPrice, { appliedMoney }) => {
    let itemCurrentSubtotalPortion = +new Big(orderLineItem.priceWithItemAmountDiscount).div(orderCurrentSubtotal)
    let itemOrderDiscount = + new Big(itemCurrentSubtotalPortion).times(appliedMoney.amount)

    return+Big(itemPrice).minus(itemOrderDiscount)
  }, orderLineItem.priceWithItemAmountDiscount))

  let priceWithTax = priceWithOrderAmountDiscounts
  if (orderLineItem.appliedTax) {
    let basePriceValue, taxValue
    
    // grouped taxes
    if (orderLineItem.taxInclusionType === 'ADDITIVE') {
      const taxPercentage = +Big(orderLineItem.appliedTax.percentage).div(100)
      // UPDATE ORDER TOTAL TAX
      taxValue = +Big(priceWithOrderAmountDiscounts).times(taxPercentage)

      // values will be used at grouped taxes
      basePriceValue = priceWithOrderAmountDiscounts

      priceWithTax = +Big(priceWithTax).plus(taxValue)
    } else if(orderLineItem.taxInclusionType === 'INCLUSIVE'){
      console.log("ERDHII")
      // inclusive basePrice price/(1+vat/100)
      basePriceValue = +Big(priceWithOrderAmountDiscounts).div(+Big(1).plus(+Big(orderLineItem.appliedTax.percentage).div(100)))
      // inclusive vatValue price - basePrice
      taxValue = +Big(priceWithOrderAmountDiscounts).minus(basePriceValue)
    }

    orderTotalTax = +Big(orderTotalTax).plus(taxValue)

    const roundedItemTax = +Big(taxValue).round(2)
    if (!Big(roundedItemTax).eq(orderLineItem.totalTaxMoney.amount)) {
      throw new Error(`item inclusive applied TAX ${orderLineItem.itemId} calculated wrong!, should be ${roundedItemTax}`)
    }

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

  // rounding (add totalMoney to order object ) 
  priceWithTax = +Big(priceWithTax).round(2)
  // HEY SHEFI IN HERE ADD the totalTaxMoney and totalDiscountMoney ROUNDED TO THE ITEM

  console.log('final pricing with tax', priceWithTax)
  if(Big(priceWithTax).lt(0)){
    throw new Error(`item ${JSON.stringify(orderLineItem)} price should not be under 0!`)
  }

  if(!Big(priceWithTax).eq(orderLineItem.totalMoney.amount)) {
    throw new Error(`item ${JSON.stringify(orderLineItem)} calculated wrong!, should be ${priceWithTax}`)
  }

})

// rounding (add this to  order object)
orderTotalMoney = +Big(orderTotalMoney).round(2)
orderTotalDiscount = +Big(orderTotalDiscount).round(2)
orderTotalTax = +Big(orderTotalTax).round(2)

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
groupedTaxes = Object.keys(groupedTaxes).map(key=> {
  let tax = groupedTaxes[key]
  // rounding taxes (add this to order object)
  return {
    ...tax,
    PriceBefVat: +Big(tax.PriceBefVat).round(2),
    VATAmt: +Big(tax.VATAmt).round(2)
  }
})

console.log(groupedTaxes)