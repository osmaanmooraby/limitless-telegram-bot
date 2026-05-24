import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("swangle"); // Use software renderer for CI/servers
Config.setConcurrency(4);
