import React from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
 
// ONLY A REFERENCE. NOT USED IN APP.
export default function App() {
  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
 
  function submitForm(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 4000);
    });
  }
 
  return (
    <div>
      <h2>Display Loader on Form Submit in React</h2>
 
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="mt-2">
          <button disabled={isSubmitting} className="btn btn-danger">
            {isSubmitting && (
              <span className="spinner-grow spinner-grow-sm"></span>
            )}
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}