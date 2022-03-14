import React from 'react'
import jsPDF from 'jspdf';
import {Button} from '@material-ui/core'

function GeneratePDF(data){
  let form_data = data;
  console.log("In generate PDF");
  console.log(form_data);


  let doc = new jsPDF();
  // form_data.forEach(function(field, i){
  //   doc.text(20, 10 + (i*10),
  //   field)
  // })
  doc.text(20, 20, form_data["Advance Required"]);
  doc.save('form.pdf');
}


export default GeneratePDF