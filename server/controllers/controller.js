// import  colleges  from "../data/colleges.js"
//these code for api conncetion which is present in the folder,that is data.

import {collegesModel} from "../models/collegeSchema.js"

let colleges = []

async function fetchInitialColleges() {
    try {
        colleges = await collegesModel.find({})

    }catch (error){
        console.log(error)
        colleges = []
    }
}

fetchInitialColleges()

// we are writing getdetails for to better understand for filtering the data 
let getDetails = (req, res) => {
    res.status(200).json({
        message: "Welcome to College Filtering API, you can search/query for engineering colleges in Maharashtra region based on courses, NIRF ranking, college status, and location. You can also search for a particular college based on its institude-code/name or filter colleges offering specific branches like Computer Science, Mechanical, AI/ML, etc.",

        routes: [
            // it's shows all colleges data which is present in the datase 
            {
                method: "GET",
                address: "localhost/colleges/api/all",
                expectedResult: "Array"
            },
            {
                method: "GET",
                address: "localhost/colleges/api/randomCollege",
                expectedResult: "Array"
            },
            {
                method: "GET",
                address: "localhost/colleges/api/filter?scope=value",
                expectedResult: "Array/Null",
                queryOptions: [
                    "courses", "duration[in years]", "status", "city"
                ],
                possibleCourses: ["Computer Science",
                    "Mechanical", "Electrical", "Civil", "Electronics", "Chemical", "Metallurgy", "IT", "AI/ML", "Data Science", "Chemical Technology", "Oil Technology", "Food Technology", "Information Technology", "Electronics & Telecommunication", "Artificial Intelligence & Data Science"
                ]

            },
            {
                method: "GET",
                address: "localhost/colleges/api/collegeName",
                expectedResult: "Array"
            },
             {
                method: "GET",
                address: "localhost/colleges/api/collegeCode",
                expectedResult: "Array"
            },
            {
                method: "POST",
                address: "localhost/colleges/api/add-college",
                expectedResult: "Array[add  a new college]"
            },
            {
                method: "Delete",
                address: "localhost/colleges/api/delete-college/:name",
                expectedResult: "delete a college"
            },
            {
                method: "Put",
                address: "localhost/colleges/api/put-college/:name",
                expectedResult: "PUT is replece the hole dta which is given by admin (Replace hole data)"
            },
            {
                method: "Patch",
                address: "localhost/colleges/api/patch-college/:name",
                expectedResult: "PATCH is chnaging some data which is given by admin (Modify some data)"
            },

        ]
    })
}

// (GET method)
// these data is for filter the college
const getFilterData = (req, res) => {
    try {

        let { courses, duration, status, city } = req.query

        let usercourse = courses

        let resultArray = colleges
        //starts as the full languages array

        let queryType = ""  //empty

        if (!courses && !duration && !status && !city) throw ("Filter is invalid !")

        // [courses part]  //if courses is exists in the query 
        if (courses) {
            resultArray = resultArray.filter(college => {
                return college.courses.some(element => element.toLowerCase().includes(usercourse.toLowerCase().trim()))
            })
            queryType += "/courses"
        }

         // [City part]  //if city is exists in the query 
        if (city) {
            resultArray = resultArray.filter((college) => {
                return college.city.toLowerCase() == city.toLowerCase().trim()
            })

            queryType += "/city"
        }


        // [duration part]  //if duration exists in the query 
        if (duration) {
            resultArray = resultArray.filter(college => {
                return Number(college.duration) === Number(duration)
            })
            queryType += "/duration"
        }

        // [status part]  //if duration exists in the query 
        if (status) {
            resultArray = resultArray.filter((college) => {
                return college.status.toLowerCase() == status.toLowerCase().trim()
            })

            queryType += "/status"
        }

        if (resultArray.length == 0) throw (`unable to find colleges based on ${queryType}`)

        // Send success response
        res.status(200).json({
            message: `got result based on ${queryType}`,
            resultCount: resultArray.length,
            results: resultArray

        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "unable to get data based on filter !",
            error,
            possibleFilters: ["?courses", "?duration", "?status", "?city"]
        })

    }
}

// (GET method) done
// these is for all colleges dada 
const getAllColleges = async (req,res) => {
    try{
        let dataBaseColleges = await collegesModel.find({})

        if(dataBaseColleges.lenght == 0) throw ("unable to fetch all colleges at this moment !")

        const totalColleges = dataBaseColleges.length;  

        res.status(200).json({ message: "All the colleges within the dataset.",
            totalColleges: totalColleges,
            data: dataBaseColleges})

    } catch(error){
        console.log("error while fetching colleges : ", error)
        res.status(500).json({ message: "unable to find colleges", error })

    }
}



 
// (GET method) // pending
// it's used to get any random college
const getRandomCollege = (req, res) => {

    console.log("Total colleges:", colleges.length);
    // console.log("First college:", colleges[0]);

    let randomIndex = Math.floor(Math.random() * colleges.length);

    let result = colleges[randomIndex];

    console.log("Random index:", randomIndex); //it's used for showing the actual index of data which is appear randomly

    res.status(200).json({ message: "Random college you were requesting is ", result })

}

// (GET method)
// it's used to find college by using college institude code
const getCollegeInstituteCode = (req,res) => {
    try {
        let {institute_Code} = req.params
        console.log(institute_Code)

        if (!institute_Code) throw("Invalid Institude_Code !")

            let result = colleges.filter((colleges) => {
                return colleges.institute_Code == institute_Code
            })

        if (result.length == 0) throw( `Unable to find colleges.institude_code ${institute_Code}`)    

        res.status(200).json({ message: `We have on institute_Code ${institute_Code} !`, result: result[0]})    

    } catch(error) {
        console.log(error)
        res.status(400).json({ message: `unable to get data based on institude code ! `, error})

    }
}

// (GET method)
// it's used to find college by using college name
const getCollegeName = (req, res) => {
    try {

        const { name } = req.params; // name comes from URL
        console.log(name);

        if (!name) throw "invalid name! ";

        // Filter the colleges array by name (case-insensitive)
        let college = colleges.find(
            (c) => c.name.toLowerCase().trim() === name.toLowerCase().trim());

        if (!college) throw `College with name "${name}" not found!`;

        res.status(200).json({
            message: `College found!`,
            result: college
        });

    } catch (error) {
        res.status(400).json({ message: "Error fetching college by name", error });
    }
}

// (GET method)
// this is for filtering colleges by founded year range (using path params)

const getCollegesBasedOnFoundedRange = (req,res) => {
    try {
        let {start, end} = req.params 
        console.log(`Founded range: ${start} - ${end}`)

        //validation as our own choice
        if (!start) throw ("Please provide at least one year!")

        // convert string to number
        start = Number(start) //for start
        end = end ? Number(end) : start;    // if end not given,then start as same

        // check for invalid number
        if (isNaN(start) || isNaN(end)) throw ("Founded year(s) must be valid numbers!")

        // filter by range
        let result = colleges.filter((college) => {
            let foundedYear = Number(college.founded);
            return foundedYear >= start && foundedYear <= end;});    

        if (result.length === 0) throw (`No colleges founded between ${start} and ${end}!`);    

        res.status(200).json({
            message: `Colleges founded between ${start} and ${end}`,
            total: result.length,
            result
        });

    } catch (error) {
        res.status(400).json({
            message: "Unable to get data based on founded year range!",
            error
        });
    }
}


// export in GET method
export { getDetails }

// export in GET method
export { getAllColleges, getRandomCollege, getFilterData, getCollegeInstituteCode, getCollegeName,getCollegesBasedOnFoundedRange }

// (post method)
// we can add data from post method
const postAddCollege = async (req, res) => {
    try {
        let { institute_Code, name, courses, duration, fees_per_year, address, status, NIRF_ranking, city, founded } = req.body;

        //scope has to be in array
         if (!institute_Code || !name || !courses || !duration || !fees_per_year || !address || !status || !NIRF_ranking || !city || !founded) throw ("invalid?incomplete data!")

        // chech the courses is an array or not

        if (!Array.isArray(courses)) throw ("invalid data courses must be an array")

        let newCollege = new collegesModel({institute_Code,name,courses,status,duration,city,founded,NIRF_ranking,fees_per_year,address});

        await newCollege.save()

        fetchInitialColleges()

        res.status(201).json({ message: "New college added successfully!", data: newCollege });

    } catch (error) {
        console.log('error while adding n new colleges !', error)
        res.status(400).json({ message: `unable to new college !`, error })
    }
}
// export in POST method
export { postAddCollege }

// (DELETE method)
// we can delete data from Delete method
const deleteInstituteByCode = async (req, res) => {
  try {
    const { institute_Code } = req.params; // URL se code le rahe hai

    // Check if institute exists with given institute_Code
    const existingInstitute = await collegesModel.findOne({ institute_Code });
    if (!existingInstitute) {
      return res.status(404).json({
        message: "Institute not found with this institute_Code!"
      });
    }
    // Delete the institute
    const deletedInstitute = await collegesModel.findOneAndDelete({ institute_Code });

    res.status(200).json({
      message: "Institute deleted successfully!",
      deleted: deletedInstitute
    });

  } catch (error) {
    console.error("Error while deleting institute:", error);
    res.status(400).json({
      message: "Unable to delete institute!",
      error: error.message
    });
  }
};

export { deleteInstituteByCode };


// (PUT method) problem
// Replace the whole college object by institute_Code
const updateInstituteByCode = async (req, res) => {
  try {
    const { institute_Code } = req.params; // URL parameter
    const newInstituteData = req.body; // request body

    // Check if institute exists
    const existingInstitute = await collegesModel.findOne({ institute_Code });
    if (!existingInstitute) {
      return res.status(404).json({
        message: `Institute with code "${institute_Code}" not found!`
      });
    }

    // Replace entire document (PUT behavior)
    const updatedInstitute = await collegesModel.findOneAndUpdate(
      { institute_Code },
      { $set: newInstituteData },
      { new: true } // return the updated document
    );

    res.status(200).json({
      message: `Institute with code "${institute_Code}" updated successfully!`,
      result: updatedInstitute
    });

  } catch (error) {
    console.error("Error updating institute:", error);
    res.status(400).json({
      message: "Error updating institute",
      error: error.message
    });
  }
};
export { updateInstituteByCode };

// (PATCH method)
// Update only specific fields of college by NAME
const patchCollegeByName = async (req, res) => {
    try {
        const { institute_Code } = req.params; // URL se code le rahe hai
        const updates = req.body; 
        // body me jo update bheja gaya hai

        // Check if college exists with given institute_Code
        const existingCollege = await collegesModel.findOne({ institute_Code });
        if (!existingCollege) {
            return res.status(404).json({ message: "College not found with this institute_Code!" });
        }

        // Update only given fields (PATCH behavior)
        const updatedCollege = await collegesModel.findOneAndUpdate(
            { institute_Code },
            { $set: updates },
            { new: true } // return updated document
        );

        res.status(200).json({
            message: "College updated successfully!",
            data: updatedCollege
        });

    } catch (error) {
        console.error("Error while updating college:", error);
        res.status(400).json({
            message: "Unable to update college!",
            error: error.message
        });
    }
};
// export in PUT method
export {patchCollegeByName}
