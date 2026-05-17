fetch('http://localhost:5000/api/goals/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'Approved' })
})
  .then(res => res.json())
  .then(data => console.log("Success:", data))
  .catch(err => console.error("Error:", err));
