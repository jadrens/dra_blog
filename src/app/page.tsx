import Navbar from "@/components/layout/Navbar";
import { Box, Avatar } from "@mui/material";
import StylizedName from "@/components/home/StylizedName";
import ConfettiBackground from "@/components/home/ConfettiBackground";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div>
      <ConfettiBackground />
      <Navbar />
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 flex items-center justify-center relative z-10">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Avatar
                src="/avatar.png"
                alt="Jadren Rayne"
                sx={{ width: 120, height: 120 }}
              />
              <StylizedName />
            </Box>
          </main>
      </div>
      <Footer />
    </div>
  );
}