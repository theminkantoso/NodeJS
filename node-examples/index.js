const rectangle = require('./rectangle');
var rect = require('./rectangle');

function solveRect(l,b) {
    console.log("Solving for rectangle with l = " + l + " and b = " + b);

    // if (l <= 0 || b <= 0) {
    //     console.log("Rectangle dimensions should be greater than zero:  l = "
    //            + l + ",  and b = " + b);
    // }
    // else {
	//     console.log("The area of the rectangle is " + rect.area(l,b));
	//     console.log("The perimeter of the rectangle is " + rect.perimeter(l,b));
    // }
    rect(l,b,(err, rectangle) => {
        if(err) {
            console.log("ERROR: ", err.message);
        }
        else {
            console.log("The area of the rectangle of dimension " 
            + l + " and b = " + b + " is " + rectangle.area());
            console.log("The perimeter of the rectangle of dimension " 
            + l + " and b = " + b + " is " + rectangle.perimeter());
        }
    });
    console.log("This statement is after the call to rect()");
    //dòng 5 đén 24 sẽ bị delay 2000ms = 2s để thực hiện do setTime out
    //trong khi đó dòng 26 tiếp tục được thực hiện nên sẽ in ra trước
    //các kết quả sẽ bị delay nhẹ rồi mới in ra sau
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);