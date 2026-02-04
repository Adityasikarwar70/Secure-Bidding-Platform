import { Box, IconButton } from "@mui/material";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const CategoryCarousel = ({ categories = [] }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        display: "flex",
        alignItems: "center",
      }}
    >
     
      <IconButton onClick={() => scroll("left")}>
        <i className="bi bi-caret-left-fill green fs-1"></i>
      </IconButton>

    
      <Box
        ref={scrollRef}
        sx={{
          flexGrow: 1,
          overflowX: "auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center", 
            minWidth: "100%",         
            py: 2,
          }}
        >
          {categories.map((cat) => (
            <Box
              key={cat.categoryId}
              onClick={() => navigate(`/all-auction/${cat.categoryId}`)}
              sx={{
                width: 120,
                height: 120,
                borderRadius: 2,
                bgcolor: "#b7e4c7",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <img src={cat.imageUrl} alt={cat.name} width={40} />
              <span className="subHeading fs-6 text-dark">
                {cat.name}
              </span>
            </Box>
          ))}
        </Box>
      </Box>

      
      <IconButton onClick={() => scroll("right")}>
        <i className="bi bi-caret-right-fill green fs-1"></i>
      </IconButton>
    </Box>
  );
};
