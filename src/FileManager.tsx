// import { Button, Flex, Heading, Image, Text } from '@aws-amplify/ui-react';
import { fetchAuthSession } from '@aws-amplify/auth';
import { Accordion, Breadcrumbs, Flex, Link, Message, Pagination, Table, TableBody, TableCell, TableHead, TableRow, View } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { Amplify } from "aws-amplify";
import { useEffect, useState } from 'react';
import { BsFileEarmarkArrowDown, BsFolder, BsFillTrashFill } from "react-icons/bs";
import { remove } from 'aws-amplify/storage';

function FileManager() {
    var [files, setFiles] = useState<any[]>([]);
    var [dirs, setDirs] = useState<any[]>([]);
    var [folders, setFolders] = useState<string[]>(["data"]);
    var [error, setError] = useState<string | null>(null);
    var [triggerReload, setTriggerReload] = useState<number>(0);
    const prefix = `${folders.join("/")}/`
    const pageSize = 20;

    useEffect(() => {
        (async function () {
            try {
                const config = Amplify.getConfig();
                const session = await fetchAuthSession();

                const client = new S3Client({
                    region: config.Storage?.S3.region,
                    credentials: session.credentials
                });
                const command = new ListObjectsV2Command({
                    Bucket: config.Storage?.S3.bucket,
                    Delimiter: "/",
                    Prefix: prefix,
                    MaxKeys: pageSize
                });

                const re = new RegExp(`^${prefix}`, "g")
                const myFiles: Array<any> = [];
                const foundDirs: Array<any> = [];

                try {
                    const result = await client.send(command);
                    result.CommonPrefixes?.forEach((res) => {
                        foundDirs.push(res.Prefix?.replace(re, ""))
                    });
                    result.Contents?.forEach((res) => {
                        if (res.Key != prefix) {
                            myFiles.push({
                                key: res.Key,
                                filename: res.Key?.replace(re, ""),
                                size: res.Size,
                                lastModified: res.LastModified
                            })
                        }
                    });
                    setDirs(Array.from(foundDirs));
                    setFiles(myFiles);
                    setError(null);
                } catch {
                    setError("You do not have sufficient permission to access files in this path")
                    setDirs([]);
                    setFiles([]);
                }


            } catch (error) {
                console.log(error);
            }
        }())
    }, [prefix, triggerReload])

    const onClickFolder = (dirname: string) => {
        setFolders([...folders, dirname.replace("/", "")]);
    }

    const refreshFiles = () => {
        setTriggerReload(triggerReload + 1)
    }

    const deleteFile = (filename: string) => {
        (async function () {
            const fullPath = prefix + filename;
            try {
                await remove({ path: fullPath });
                refreshFiles();
            } catch {
            }
        }())
    }

    return (
        <Flex
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            wrap="nowrap"
            gap="1rem"
        >
            <Flex direction="row" gap="1rem" justifyContent="flex-end" alignItems="baseline">
                <View flex="1 0 auto">
                    <Breadcrumbs.Container>
                        {folders.map((f, i, l) => (
                            <Breadcrumbs.Item key={f}>
                                <Breadcrumbs.Link onClick={() => setFolders(l.slice(0, i + 1))}>{f}</Breadcrumbs.Link>
                                <Breadcrumbs.Separator />
                            </Breadcrumbs.Item>
                        ))}
                    </Breadcrumbs.Container>
                </View>
            </Flex>
            {!error &&
                <Accordion.Container>
                    <Accordion.Item value="Accordion-item">
                        <Accordion.Trigger>
                            Uploader
                            <Accordion.Icon />
                        </Accordion.Trigger>
                        <Accordion.Content>
                            <StorageManager
                                path={prefix}
                                maxFileCount={1}
                                isResumable
                                onUploadSuccess={refreshFiles}
                            />
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion.Container>
            }
            <View>
                <Table caption="" highlightOnHover={false} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell as="th">Name</TableCell>
                            <TableCell as="th">Size</TableCell>
                            <TableCell as="th">Last Modified</TableCell>
                            <TableCell as="th">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!error &&
                            <>
                                {
                                    dirs.map(x => (
                                        <TableRow key={x}>
                                            <TableCell>
                                                <Flex gap="0.5rem" alignItems="center">
                                                    <BsFolder />
                                                    <Link onClick={() => onClickFolder(x)}>{x}</Link>
                                                </Flex>
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    ))
                                }
                                {files.map(x => (
                                    <TableRow key={x.key}>
                                        <TableCell>
                                            <Flex gap="0.5rem" alignItems="center">
                                                <BsFileEarmarkArrowDown />
                                                <Link onClick={() => alert("Download not yet")}>{x.filename}</Link>
                                            </Flex>
                                        </TableCell>
                                        <TableCell>{x.size}</TableCell>
                                        <TableCell>{x.lastModified.toLocaleString()}</TableCell>
                                        <TableCell><BsFillTrashFill onClick={() => deleteFile(x.filename)} /></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        }
                    </TableBody>
                </Table>
                {error && <Message colorTheme="error">{error}</Message>}

            </View>
            <View>
                <Pagination currentPage={1} totalPages={10} siblingCount={1} />
            </View>

        </Flex>
    );
}

export default FileManager;