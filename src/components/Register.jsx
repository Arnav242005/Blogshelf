import React from "react";
import { useForm } from "react-hook-form";
import "../register.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import emailjs from "emailjs-com";

function Register() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharacterAllowed] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmpass: "",
      email: "",
    },
  });

  const onSubmit = async (formdata) => {
    const { username, email, password, confirmpass } = formdata;

    if (password !== confirmpass) {
      alert("Passwords do not match");
      return;
    }

    try {
      setIsSending(true);

      // Step 1: Check if user already exists
      const existingUsers = await axios.get(
        `https://688f6c68f21ab1769f8927ce.mockapi.io/users`
      );
      const emailExists = existingUsers.data.some(
        (user) => user.email === email
      );

      if (emailExists) {
        alert("This email is already registered with us.");
        setIsSending(false);
        return;
      }

      // Step 2: Proceed with registration
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const response = await axios.post(
        `https://688f6c68f21ab1769f8927ce.mockapi.io/users`,
        {
          username,
          email,
          password: hashedPassword,
        }
      );

      await emailjs
        .send(
          "service_pb9amxd",
          "template_3egsrsk",
          {
            to_email: email,
            to_name: username,
            password: password,
          },
          "GuvZy6S-iO7DeUZiX"
        )
        .then((result) => {
          console.log("Email sent successfully:", result.text);
          alert("An email has been sent to you!");
        })
        .catch((error) => {
          console.error("Email sending failed:", error);
          alert("Email sending failed. Please try again later.");
        });

      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsSending(false);
    }
  };

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "{[|@}/#$%]";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }

    setGeneratedPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, generatedPassword.length);
    window.navigator.clipboard.writeText(generatedPassword);
  }, [generatedPassword]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  return (
    <>
      <div className="maindiv">
        <div className="formdiv">
          <h2 className="registerhead">Registration</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: true })}
            />
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmpass", { required: true })}
            />
            <button type="submit" className="registerbtn" disabled={isSending}>
              {isSending ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        <div className="passwordgenerator">
          <h1 className="genpassheading">Generate Password</h1>
          <div>
            <div className="firstrow">
              <input
                type="text"
                value={generatedPassword}
                placeholder="password"
                readOnly
                ref={passwordRef}
              />
              <button className="copybtn" onClick={copyPasswordToClipboard}>
                Copy
              </button>
            </div>

            <div className="otherpassdiv">
              <div>
                <input
                  type="range"
                  min={8}
                  max={50}
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                />
                <label>Length: {length}</label>
              </div>

              <div className="checkboxes">
                <div className="numcheck">
                  <input
                    type="checkbox"
                    defaultChecked={numberAllowed}
                    id="numberInput"
                    onChange={() => setNumberAllowed((prev) => !prev)}
                  />
                  <label>Numbers</label>
                </div>

                <div className="charcheck">
                  <input
                    type="checkbox"
                    defaultChecked={charAllowed}
                    id="characterInput"
                    onChange={() => setCharacterAllowed((prev) => !prev)}
                  />
                  <label>Special Characters</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
