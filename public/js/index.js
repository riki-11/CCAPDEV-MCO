document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(button => {
        button.addEventListener("click", handleDelete);
    });
});

async function handleDelete(event) {
    event.preventDefault(); 
    const reviewId = event.target.dataset.reviewId;
    console.log("Deleting");
    console.log(reviewId);
    try {
        const response = await fetch(`/deleteReviews?reviewId=${reviewId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            // Deletion successful, reload the screen
            window.location.reload();
        } else {
            // Handle error if needed
            console.error("Failed to delete review");
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
