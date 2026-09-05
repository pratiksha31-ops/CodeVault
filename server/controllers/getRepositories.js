const getRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      repositories,
    });
  } catch (error) {
    console.error("Get repositories error:", error);

    res.status(500).json({
      message: "Failed to fetch repositories",
      error: error.message,
    });
  }
};