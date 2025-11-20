import './App.css'

function App() {
  const paymentHandler = async (event) => {
    const amount=500;
    const currency="INR";
    const receiptId = "rcptid_11";
    
    const res = await fetch("http://localhost:5000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency, receipt: receiptId , payment_capture: 1 }),
    });
    const data = await res.json();
    console.log(data);

    const options = {
      key: "rzp_test_RhfCKifttOwMXz", // Enter the Key ID generated from the Dashboard
      amount: data.amount.toString(),
      currency: "INR",
      name: "Cosmos Digital",
      description: "Test Transaction",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpwCnl3vyOC6u0eMdtqyciDJ1qT1xEIrnAWA&s",
      order_id: data.id,
      handler: async function (response) {
        const body={...response}
        const validateRes=await fetch("http://localhost:5000/validate",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(body),
        });
        const jsonRes=await validateRes.json();
        alert(jsonRes.message);
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav1912@gmail.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
      alert("Payment Failed");
      console.log(response);
    });
    rzp1.open();
    event.preventDefault();
    

}


  return (
    <>
    <div className="product">
      <h1>Razorpay Payment Gateway</h1>
      <button className="button" onClick={paymentHandler}>Pay Now</button>
    </div>
      
    </>
  )
}

export default App
