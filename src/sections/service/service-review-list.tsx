// @mui
import Pagination, { paginationClasses } from "@mui/material/Pagination";
// types
import { IServiceReview } from "src/types/service";
//
import ServiceReviewItem from "./service-review-item";

// ----------------------------------------------------------------------

type Props = {
  reviews: IServiceReview[];
};

export default function ServiceReviewList({ reviews }: Props) {
  return (
    <>
      {reviews.map((review) => (
        <ServiceReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={10}
        sx={{
          mx: "auto",
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: "auto",
            justifyContent: "center",
          },
        }}
      />
    </>
  );
}
