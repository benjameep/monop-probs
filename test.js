//var normal = "1 3 5 6 8 9 11 12 13 14 15 16 18 19 \
//21 23 24 25 26 27 28 29 31 32 34 35 37 39".split(' ')
//var mine =   "5 4 3 2 1 0 17 16 15 14 13 12 11 10 \
//20 21 22 23 24 25 26 27 30 31 32 33 34 35".split(' ')
//
//var data = normal.reduce( (obj,place,i) => {
//    obj[place] = mine[i]
//    return obj
//},{})
//
//console.log(JSON.stringify(data))
//Array.prototype.shuffle = function(){
//    for (let i = this.length; i; i--) {
//        let j = Math.floor(Math.random() * i);
//        [this[i - 1], this[j]] = [this[j], this[i - 1]];
//    }
//    return this
//}

//var chanceCards = ["$50","$200","$-15","$150","$100",0,24,
//                   11,5,39,"Railx2","Railx2",
//                   "Utilx10","JailCard","-3","GoJail","hRepairs","$-50x"]
//var communCards = [0,"$200","$-50","$50","JailCard","GoJail","$50x","$100",
//                  "$20","$10x","$100","$-100","$-150","$25","sRepairs","$10","$100"]
//
//function followCard(card){
//    if(card[0] == '$'){
//        amount = card.slice(1)
//        if(isNaN(amount))
//            amount = amount.slice(0,-1)
//        else
//            amount = amount*1
//        console.log(amount)
//    } else if (Number.isInteger(card)){
//        console.log("Go to "+card)
//    } else {
//		switch(card){
//			case "Railx2":
//				break;
//			case "Utilx10":
//				break;
//			case "JailCard":
//				break;
//			case "GoJail":
//				break;
//			case "-3":
//				break;
//			case "hRepairs": // $25 $100
//				break;
//			case "sRepairs": // $40 $115
//				break;
//		}
//	}
//}
//
//chanceCards.forEach(followCard)


console.log("Single" <= 4)
