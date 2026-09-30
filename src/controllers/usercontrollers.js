
import { UserModel } from "../models/userModel.js";
import { userValidator, loginValidator } from "../validator/userValidator.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utility/generateToken.js";


export const getHome = (req, res) => {
  res.send("Home Page!, server is running.");
}

export const getAbout = (req, res) => {
  res.send("This is my about page and server is running.");
}

export const postUser = async(req, res) => {
  try {
    const {username, email, password} = req.body

   const {error} = userValidator.validate({
    username,
    email,
    password
   })

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: `User with this ${email} already exists, please login instead`
    });
  }

  const newUser = await UserModel.create({
    username,
    email,
    password  
  })

  const token = await generateToken(newUser._id)

  res.cookie("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days convert to milliseconds
  })


  res.status(201).json({
    data: newUser,
    message: "User created successfully"
  })
  
  } catch (error) {
  console.error(error)
  throw new Error(error)
  }
}

export const login = async (req, res) => {
  try {
    const {email, password} = req.body

    const {error} = loginValidator.validate({
      email,
      password
    })

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }
    
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: `User with this ${email} does not exist, please signup instead`
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials, please try again"
      });
    }

    const token = await generateToken(existingUser._id)

    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days convert to milliseconds
    })

    res.status(200).json({
      data: existingUser,
      message: " User Login successfully",
    })


  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}


export const getSingleuser = async (req, res) => {
  try {
    const {id} = req.params
    const user = await UserModel.findById(id).select("-password") //always exclude the password field when returning user data

    if(!user) {
      return res.status(404).json({
        message: `User with ${id} does not exist`
      })
    }

    res.status(200).json({
      data: user,
      message: `user with ${id} retrieved successfully`
    })

  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}
 