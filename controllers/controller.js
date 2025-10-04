import { colleges } from "../data/colleges.js"
//these code for api conncetion which is present in the folder,that is data.

// we are writing getdetails for to better understand for filtering the data 
let getDetails = (req, res) => {
    res.status(200).json({
        message: "Welcome to College Filtering API, you can search/query for engineering colleges in Nagpur region based on courses, NIRF ranking, college status, and location. You can also search for a particular college based on its name or filter colleges offering specific branches like Computer Science, Mechanical, AI/ML, etc.",

        routes: [
            // it's shows all colleges data which is present in the datase 
            {
                method: "GET",
                address: "localhost/colleges/api/all",
                expectedResult: "Array"
            }
        ]
    })
}

// (get method)
// these is for all colleges dada 
const getAllColleges = (req,res) => {
    res.status(200).json({ message: `All the colleges within the dataset are`, colleges })
}




// export in GET method
export {getDetails,getAllColleges}

// export in POST method

// export in DELETE method
