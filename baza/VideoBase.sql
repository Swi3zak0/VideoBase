toc.dat                                                                                             0000600 0004000 0002000 00000003430 14572146052 0014445 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   6                    |         
   Video-Base    16.2    16.0     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         �           1262    16399 
   Video-Base    DATABASE        CREATE DATABASE "Video-Base" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Polish_Poland.1250';
    DROP DATABASE "Video-Base";
                postgres    false         �            1259    16400    users    TABLE     ;  CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(20) NOT NULL,
    password character varying(32) NOT NULL,
    email character varying(32) NOT NULL,
    createdate character varying(32) NOT NULL,
    premium boolean DEFAULT false NOT NULL,
    frame character varying(32)
);
    DROP TABLE public.users;
       public         heap    postgres    false         �          0    16400    users 
   TABLE DATA           ^   COPY public.users (userid, username, password, email, createdate, premium, frame) FROM stdin;
    public          postgres    false    215       4833.dat Q           2606    16404    users Users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (userid);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT "Users_pkey";
       public            postgres    false    215                                                                                                                                                                                                                                                4833.dat                                                                                            0000600 0004000 0002000 00000000161 14572146052 0014257 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	Kowalec	Qwerty123456	JanKowal@wp.pl	00-00-0000	f	default
2	Mandzio	Krowa213	Man@wp.pl	01-01-2012	t	golden
\.


                                                                                                                                                                                                                                                                                                                                                                                                               restore.sql                                                                                         0000600 0004000 0002000 00000004341 14572146052 0015374 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "Video-Base";
--
-- Name: Video-Base; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "Video-Base" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Polish_Poland.1250';


ALTER DATABASE "Video-Base" OWNER TO postgres;

\connect -reuse-previous=on "dbname='Video-Base'"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(20) NOT NULL,
    password character varying(32) NOT NULL,
    email character varying(32) NOT NULL,
    createdate character varying(32) NOT NULL,
    premium boolean DEFAULT false NOT NULL,
    frame character varying(32)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (userid, username, password, email, createdate, premium, frame) FROM stdin;
\.
COPY public.users (userid, username, password, email, createdate, premium, frame) FROM '$$PATH$$/4833.dat';

--
-- Name: users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (userid);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               