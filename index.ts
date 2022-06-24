import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as mime from "mime";
import { readdirSync } from "fs";
import { join } from "path";

const bucket = new aws.s3.Bucket("celtiberian-pulumi-bucket", {
  website: {
    indexDocument: "index.html",
  },
});

const siteDir = "app";

for (const item of readdirSync(siteDir)) {
  const filePath = join(siteDir, item);
  const object = new aws.s3.BucketObject(item, {
    acl: "public-read",
    bucket,
    source: new pulumi.asset.FileAsset(filePath),
    contentType: mime.getType(filePath) || undefined,
  });
}

// Export the name of the bucket
export const bucketEndpoint = pulumi.interpolate`http://${bucket.websiteEndpoint}`;
