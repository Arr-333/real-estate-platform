import { Box } from "@mui/material";
import UpcomingHome from "@/components/UpcomingHome";
import TrendingProp from "@/components/TrendingProp";
import Search from "@/components/Search/Search";

export default function Home() {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: {
            xs: "60vh", // mobile
            sm: "70vh", // small tablets
            md: "85vh", // laptops
            lg: "100vh", // desktop
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url("/assets/hero-bg.jpg")`, // Note the leading slash
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 2, // above overlay
            width: "100%",
            maxWidth: "800px",
            px: 2,
          }}
        >
          <Search />
        </Box>
      </Box>

      <TrendingProp />
      <UpcomingHome />
    </>
  );
}
